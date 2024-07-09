from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User,on_delete= models.CASCADE, related_name= "notes") 
    # One to many relationship between user and notes : from User object we can access notes using .notes which was created by that user

    def __str__(self):
        return self.title

    
