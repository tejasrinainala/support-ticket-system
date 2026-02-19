from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import TicketViewSet, TicketStatsView, TicketClassifyView

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('tickets/stats/', TicketStatsView.as_view()),
    path('tickets/classify/', TicketClassifyView.as_view()),
]

urlpatterns += router.urls
