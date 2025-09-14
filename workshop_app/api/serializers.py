from rest_framework import serializers
from django.contrib.auth.models import User
from workshop_app.models import (
    Profile, WorkshopType, AttachmentFile, Workshop, Testimonial, Comment, Banner
)
from cms.models import Nav, SubNav, Page, StaticFile
from teams.models import Team

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'groups')

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'

class WorkshopTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopType
        fields = '__all__'

class AttachmentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttachmentFile
        fields = '__all__'

class WorkshopSerializer(serializers.ModelSerializer):
    coordinator = UserSerializer(read_only=True)
    instructor = UserSerializer(read_only=True)
    workshop_type = WorkshopTypeSerializer(read_only=True)
    coordinator_id = serializers.IntegerField(write_only=True, required=False)
    workshop_type_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Workshop
        fields = '__all__'

    def create(self, validated_data):
        # Set coordinator to current user if not provided
        if 'coordinator_id' not in validated_data:
            validated_data['coordinator_id'] = self.context['request'].user.id
        
        # Create the workshop
        workshop = Workshop.objects.create(
            coordinator_id=validated_data['coordinator_id'],
            workshop_type_id=validated_data['workshop_type_id'],
            date=validated_data['date'],
            status=validated_data.get('status', 0),  # Default to pending
            tnc_accepted=validated_data.get('tnc_accepted', False)
        )
        return workshop

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    workshop = WorkshopSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = '__all__'

class NavSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nav
        fields = '__all__'

class SubNavSerializer(serializers.ModelSerializer):
    nav = NavSerializer(read_only=True)
    class Meta:
        model = SubNav
        fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'

class StaticFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticFile
        fields = '__all__'


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({'new_password2': ["New passwords must match."]})
        return data

class TeamSerializer(serializers.ModelSerializer):
    members = ProfileSerializer(many=True, read_only=True)
    creator = UserSerializer(read_only=True)
    class Meta:
        model = Team
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    profile_data = serializers.DictField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password2', 'profile_data')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password2': ["Passwords must match."]})
        return data

    def create(self, validated_data):
        profile_data = validated_data.pop('profile_data', {})
        validated_data.pop('password2')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            is_active=False
        )
        
        # Create profile
        Profile.objects.create(
            user=user,
            **profile_data
        )
        
        return user
