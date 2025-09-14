from django.urls import path
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('forgotpassword/', auth_views.PasswordResetView.as_view(), name="password_reset"),
    path('password_reset/<uidb64>-<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password_reset/mail_sent/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password_reset/complete/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('changepassword/', auth_views.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),
]
