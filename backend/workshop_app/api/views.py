from django.db import models
from rest_framework import viewsets
from django.contrib.auth.models import User
from .serializers import (
    UserSerializer, ProfileSerializer, WorkshopTypeSerializer,
    AttachmentFileSerializer, WorkshopSerializer, TestimonialSerializer,
    CommentSerializer, BannerSerializer, NavSerializer, SubNavSerializer, PageSerializer, StaticFileSerializer, TeamSerializer, ChangePasswordSerializer, UserRegistrationSerializer
)
from workshop_app.models import (
    Profile, WorkshopType, AttachmentFile, Workshop, Testimonial, Comment, Banner
)
from cms.models import Nav, SubNav, Page, StaticFile
from teams.models import Team
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from workshop_app.serializers import CustomTokenObtainPairSerializer
from django.conf import settings

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class WorkshopTypeViewSet(viewsets.ModelViewSet):
    queryset = WorkshopType.objects.all()
    serializer_class = WorkshopTypeSerializer

class AttachmentFileViewSet(viewsets.ModelViewSet):
    queryset = AttachmentFile.objects.all()
    serializer_class = AttachmentFileSerializer

class WorkshopViewSet(viewsets.ModelViewSet):
    queryset = Workshop.objects.all()
    serializer_class = WorkshopSerializer

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer

class NavViewSet(viewsets.ModelViewSet):
    queryset = Nav.objects.all()
    serializer_class = NavSerializer

class SubNavViewSet(viewsets.ModelViewSet):
    queryset = SubNav.objects.all()
    serializer_class = SubNavSerializer

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer

class StaticFileViewSet(viewsets.ModelViewSet):
    queryset = StaticFile.objects.all()
    serializer_class = StaticFileSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # Set new password
            self.object.set_password(serializer.data.get("new_password1"))
            self.object.save()
            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def workshop_public_stats_api(request):
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    state = request.GET.get('state')
    workshoptype = request.GET.get('workshop_type')
    sort = request.GET.get('sort', 'date')

    workshops = Workshop.objects.filter(status=1)

    if from_date and to_date:
        workshops = workshops.filter(date__range=(from_date, to_date))
    else:
        today = timezone.now()
        upto = today + timedelta(days=15)
        workshops = workshops.filter(date__range=(today, upto))
    
    if state:
        workshops = workshops.filter(coordinator__profile__state=state)
    if workshoptype:
        workshops = workshops.filter(workshop_type_id=workshoptype)
    
    workshops = workshops.order_by(sort)

    # Replicate get_workshops_by_state and get_workshops_by_type logic
    ws_states, ws_count = Workshop.objects.get_workshops_by_state(workshops)
    ws_type, ws_type_count = Workshop.objects.get_workshops_by_type(workshops)

    serializer = WorkshopSerializer(workshops, many=True)

    return Response({
        'workshops': serializer.data,
        'ws_states': ws_states,
        'ws_count': ws_count,
        'ws_type': ws_type,
        'ws_type_count': ws_type_count,
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def team_stats_api(request, team_id=None):
    user = request.user
    teams = Team.objects.all()
    if team_id:
        team = teams.get(id=team_id)
    else:
        team = teams.first()

    if not team.members.filter(user=user).exists():
        return Response(
            {"detail": "You are not added to the team"},
            status=status.HTTP_403_FORBIDDEN
        )

    member_workshop_data = {}
    for member in team.members.all():
        workshop_count = Workshop.objects.filter(
            instructor=member.user).count()
        member_workshop_data[member.user.get_full_name()] = workshop_count
    team_labels = list(member_workshop_data.keys())
    ws_count = list(member_workshop_data.values())

    return Response({
        'team_labels': team_labels,
        'ws_count': ws_count,
        'all_teams': TeamSerializer(teams, many=True).data,
        'team_id': team.id,
    }, status=status.HTTP_200_OK) 

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.save()

        # For development, automatically activate users
        if settings.DEBUG:
            user.is_active = True
            user.save()
            return Response({
                'message': 'Registration successful! Your account has been automatically activated for development.',
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        else:
            # Production: Send activation email
            current_site = get_current_site(request)
            mail_subject = 'Activate your account.'
            message = render_to_string('workshop_app/activation.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': default_token_generator.make_token(user),
            })
            email = EmailMessage(mail_subject, message, to=[user.email])
            email.send()

            return Response({
                'message': 'Registration successful, please check your email for activation.',
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def activate_user_api(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'message': 'Account activated successfully!'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Activation link is invalid!'}, status=status.HTTP_400_BAD_REQUEST) 

@api_view(['POST'])
def accept_workshop_api(request, pk):
    try:
        workshop = Workshop.objects.get(pk=pk)
    except Workshop.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not request.user.groups.filter(name='instructor').exists():
        return Response({'detail': 'Only instructors can accept workshops.'}, status=status.HTTP_403_FORBIDDEN)

    workshop.status = 1  # Accepted
    workshop.instructor = request.user  # Assign current user as instructor
    workshop.save()
    return Response({'message': 'Workshop accepted successfully!'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def change_workshop_date_api(request, pk):
    try:
        workshop = Workshop.objects.get(pk=pk)
    except Workshop.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not request.user.groups.filter(name='instructor').exists():
        return Response({'detail': 'Only instructors can change workshop dates.'}, status=status.HTTP_403_FORBIDDEN)

    new_date = request.data.get('date')
    if not new_date:
        return Response({'date': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

    workshop.date = new_date
    workshop.save()
    return Response({'message': 'Workshop date changed successfully!'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_attachment_file_api(request, pk):
    try:
        attachment_file = AttachmentFile.objects.get(pk=pk)
    except AttachmentFile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # TODO: Add permission checks here (e.g., only admin or owner can delete)

    attachment_file.delete()
    return Response({'message': 'Attachment deleted successfully!'}, status=status.HTTP_204_NO_CONTENT) 

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_workshop_api(request, pk):
    """Accept a workshop proposal"""
    try:
        workshop = Workshop.objects.get(pk=pk)
        if workshop.status != 0:  # Not pending
            return Response({'message': 'Workshop is not pending'}, status=status.HTTP_400_BAD_REQUEST)
        
        workshop.status = 1  # Accepted
        workshop.instructor = request.user
        workshop.save()
        
        return Response({'message': 'Workshop accepted successfully'}, status=status.HTTP_200_OK)
    except Workshop.DoesNotExist:
        return Response({'message': 'Workshop not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_workshop_date_api(request, pk):
    """Change workshop date"""
    try:
        workshop = Workshop.objects.get(pk=pk)
        new_date = request.data.get('date')
        
        if not new_date:
            return Response({'message': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        workshop.date = new_date
        workshop.save()
        
        return Response({'message': 'Workshop date updated successfully'}, status=status.HTTP_200_OK)
    except Workshop.DoesNotExist:
        return Response({'message': 'Workshop not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_attachment_file_api(request, pk):
    """Delete an attachment file"""
    try:
        attachment = AttachmentFile.objects.get(pk=pk)
        attachment.delete()
        return Response({'message': 'Attachment deleted successfully'}, status=status.HTTP_200_OK)
    except AttachmentFile.DoesNotExist:
        return Response({'message': 'Attachment not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_workshops_api(request):
    """Get workshops for the current user"""
    user = request.user
    
    # Get workshops where user is coordinator or instructor
    workshops = Workshop.objects.filter(
        models.Q(coordinator=user) | models.Q(instructor=user)
    ).order_by('-date')
    
    serializer = WorkshopSerializer(workshops, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
