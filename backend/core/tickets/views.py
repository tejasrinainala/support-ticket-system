from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Ticket
from .serializers import TicketSerializer
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
import os
import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        category = self.request.query_params.get('category')
        priority = self.request.query_params.get('priority')
        status_param = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if category:
            queryset = queryset.filter(category=category)
        if priority:
            queryset = queryset.filter(priority=priority)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        return queryset

class TicketStatsView(APIView):

    def get(self, request):
        tickets = Ticket.objects.all()

        total_tickets = tickets.count()
        open_tickets = tickets.filter(status='open').count()

        tickets_per_day = tickets.annotate(
            day=TruncDate('created_at')
        ).values('day').annotate(
            count=Count('id')
        )

        avg_tickets_per_day = tickets_per_day.aggregate(
            avg=Avg('count')
        )['avg'] or 0

        priority_breakdown = tickets.values('priority').annotate(
            count=Count('id')
        )

        category_breakdown = tickets.values('category').annotate(
            count=Count('id')
        )

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_tickets_per_day, 1),
            "priority_breakdown": {
                item['priority']: item['count'] for item in priority_breakdown
            },
            "category_breakdown": {
                item['category']: item['count'] for item in category_breakdown
            }
        })

class TicketClassifyView(APIView):

    def post(self, request):
        description = request.data.get('description')

        if not description:
            return Response(
                {"error": "description is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            openai.api_key = os.getenv("OPENAI_API_KEY")

            prompt = f"""
You are a support ticket classifier.
Classify the following ticket description into:
Category: one of [billing, technical, account, general]
Priority: one of [low, medium, high, critical]

Description:
{description}

Return ONLY valid JSON like:
{{"category": "...", "priority": "..."}}
"""

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0
            )

            result = response.choices[0].message["content"]

            import json
            data = json.loads(result)

            return Response({
                "suggested_category": data.get("category", "general"),
                "suggested_priority": data.get("priority", "low")
            })

        except Exception:
            # Graceful fallback
            return Response({
                "suggested_category": "general",
                "suggested_priority": "low"
            })