from django.db import models
from UserManagement.models import User

# Create your models here.
class Friendship(models.Model):
    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_from')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_to')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='sent')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.from_user.username} - {self.to_user.username} ({self.status})'


class   FriendsProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='friend_profile')
    friends = models.ManyToManyField(User, blank=True, related_name='friends_of_user')


    def get_friends(self):
        return self.friends.all()
    
    def get_friends_number(self):
        return self.friends.all().count()
    
    def remove_friend(self, friend):
        if friend in self.friends.all():
            self.friends.remove(friend)
            return True
        return False


    def __str__(self):
        return str(self.user) + "'s friend"

