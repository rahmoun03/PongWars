from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
import os
from django.utils import timezone

class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    image = models.ImageField(upload_to='images/', default='/images/default.jpg')
    email = models.EmailField(unique=True)
    otp =  models.CharField(max_length = 6, null = True, blank=True)
    otp_expiry_time = models.DateTimeField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    score = models.PositiveBigIntegerField(default=0)
    use_otp = models.BooleanField(default=True)

    def delete_image(self):
        if self.image:
            try:
                os.remove(self.image.path)
            except FileNotFoundError:
                pass

        self.image = '/images/default.jpg'
        self.save()

# def save_post_user(sender, instance, **kwargs):
#     print("a user has been saved")

# post_save.connect(save_post_user, sender=User)


class Stats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name="stats")
#if a User object is deleted, all related Stats objects will also be deleted.
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    total = models.IntegerField(default=0)# wins - losses (for the game rank, it can be negative) 
 
    def __str__(self):
        return f"{self.user.username} stats"
    


class MatchHistory(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='matches_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='matches_as_user2')
    user1_score = models.PositiveIntegerField(null=True)
    user2_score = models.PositiveIntegerField(null=True)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='matches_as_winner')
    played_at = models.DateField(auto_now=True)
    game_type = models.CharField(null=True, max_length=10)
    is_draw = models.BooleanField(default=0)
    game_id = models.CharField(max_length=255, null=True)
    created = models.DateTimeField(editable=False)
    # time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user1.username} vs {self.user2.username}"
    
    def save(self, *args, **kwargs):
        self.created = timezone.now()
        return super(MatchHistory, self).save(*args, **kwargs)

#on_delete=models.CASCADE: if a User object is deleted, all related MatchHistory objects will also be deleted.
    # 1v1 games, dates, and relevant details
    
    # def __str__(self):
    #     return f"Match between {self.user1} and {self.user2} on {self.played_at}"


# class Friendship(models.Model):
#     STATUS_CHOICES = [
#         ('sent', 'Sent'),
#         ('accepted', 'Accepted'),
#         ('rejected', 'Rejected'),
#     ]
    
#     from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_from')
#     to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_to')
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='sent')
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f'{self.from_user.username} - {self.to_user.username} ({self.status})'


# class   FriendsProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='friend_profile')
#     friends = models.ManyToManyField(User, blank=True, related_name='friends_of_user')


#     def get_friends(self):
#         return self.friends.all()
    
#     def get_friends_number(self):
#         return self.friends.all().count()
    
#     def remove_friend(self, friend):
#         if friend in self.friends.all():
#             self.friends.remove(friend)
#             return True
#         return False


#     def __str__(self):
#         return str(self.user) + "'s friend"




# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     friends = models.ManyToManyField(User, related_name='friends', blank=True)
    

#     def get_friends(self):
#         return self.friends.all()
    
#     def get_friends_number(self):
#         return self.friends.all().count()
    
#     def __str__(self):
#         return str(self.user)
    

# STATUS_CHOICES = {
#     ('send', 'send'),
#     ('accepted', 'accepted'),
# }

# class Relationship(models.Model):
#     sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sender')
#     receiver = models.ForeignKey(Profile,  on_delete=models.CASCADE, related_name='receiver')
#     status = models.CharField(max_length=50, choices=STATUS_CHOICES)
        



# @receiver(pre_save, sender=Relationship)


# def print_email(sender, instance, **kwargs):
#     print("hello")
#     # print(instance.status)
    
# def print_email1(sender, instance, **kwargs):
#     print("ksdjf;lksdf;lk")
    # print(instance.status)
    
# class Friendship(models.Model):
    
    
    
    
    
    
    
# class friendships(models.Model):
#     #user1
#     #user2
#     #state frind: treu , blocked: false, 
#     pass


# class Friendship(models.Model):
    
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user")
#     friends = models.ManyToManyField(User, blank=True, related_name="friends")
    
#     def __str__(self):
#         return self.user.username
    
#     def add_friend(self, account):
#         if not account in self.friends.all():
#             self.friends.add(account)
#             self.save()
    
#     def remove_friend(self, account):
#         if account in self.friends.all():
#             self.frerinds.add(account)

# add a friend row in the user 