"""workshop_portal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.urls import path, re_path, include
from workshop_app import views
from rest_framework.routers import DefaultRouter
from workshop_app.api import views as api_views

app_name = "workshop_app"

router = DefaultRouter()
router.register(r'users', api_views.UserViewSet)
router.register(r'profiles', api_views.ProfileViewSet)
router.register(r'workshop-types', api_views.WorkshopTypeViewSet)
router.register(r'attachment-files', api_views.AttachmentFileViewSet)
router.register(r'workshops', api_views.WorkshopViewSet)
router.register(r'testimonials', api_views.TestimonialViewSet)
router.register(r'comments', api_views.CommentViewSet)
router.register(r'banners', api_views.BannerViewSet)
router.register(r'navs', api_views.NavViewSet)
router.register(r'subnavs', api_views.SubNavViewSet)
router.register(r'pages', api_views.PageViewSet)
router.register(r'static-files', api_views.StaticFileViewSet)
router.register(r'teams', api_views.TeamViewSet)

urlpatterns = [
    re_path(r'^', include(router.urls)),
    path('', views.index, name='index'),
    # API endpoints first
    path('public-workshop-stats/', api_views.workshop_public_stats_api, name='public_workshop_stats_api'),
    path('team-stats/', api_views.team_stats_api, name='team_stats_api'),
    path('team-stats/<int:team_id>/', api_views.team_stats_api, name='team_stats_api_id'),
    path('register/', api_views.register_user, name='api_register_user'),
    path('activate_user/<str:uidb64>/<str:token>/', api_views.activate_user_api, name='activate_user_api'),
    path('change-password/', api_views.ChangePasswordView.as_view(), name='change_password'),
    path('workshops/<int:pk>/accept/', api_views.accept_workshop_api, name='accept_workshop_api'),
    path('workshops/<int:pk>/change-date/', api_views.change_workshop_date_api, name='change_workshop_date_api'),
    path("my-workshops/", api_views.get_user_workshops_api, name="get_user_workshops_api"),
    path('attachment-files/<int:pk>/', api_views.delete_attachment_file_api, name='delete_attachment_file_api'),
    # Django views
    path('register/', views.user_register, name="register"),
    path('activate_user/<str:key>', views.activate_user),
    path('activate_user/', views.activate_user),
    path('login/', views.user_login, name="login"),
    path('logout/', views.user_logout, name="logout"),
    path('status', views.workshop_status_coordinator, name='workshop_status_coordinator'),
    path('dashboard', views.workshop_status_instructor, name='workshop_status_instructor'),
    path('accept_workshop/<int:workshop_id>', views.accept_workshop, name='accept_workshop'),
    path('change_workshop_date/<int:workshop_id>', views.change_workshop_date, name='change_workshop_date'),
    path('details/<int:workshop_id>', views.workshop_details, name='workshop_details'),
    path('type_details/<int:workshop_type_id>', views.workshop_type_details, name='workshop_type_details'),
    path('type_tnc/<int:workshop_type_id>', views.workshop_type_tnc, name='workshop_type_tnc'),
    path('propose/', views.propose_workshop, name='propose_workshop'),
    path('add_workshop_type', views.add_workshop_type, name='add_workshop_type'),
    path('delete_attachment_file/<int:file_id>', views.delete_attachment_file, name='delete_attachment_file'),
    path('types/', views.workshop_type_list, name='workshop_type_list'),
    path('view_profile/', views.view_own_profile, name='view_own_profile'),
    path('view_profile/<int:user_id>', views.view_profile, name='view_profile'),
]
