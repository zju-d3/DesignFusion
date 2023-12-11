from django.db import models

# Create your models here.

# Message类中的meesage用于存储历史信息，ID作为”唯一识别码“，新更新的UI界面通过唯一的ID来检索历史
# 信息，每一个textarea文本框中的文字都对应着唯一的一个Message对象（在views.py中创建）
class Message(models.Model):
    message=models.CharField(max_length=50)
    ID=models.CharField(max_length=50)
    
    def __str__(self):
        return self.message
        
@classmethod
def create(Message, message='hello', ID='hi'):
    return Message(message=message,ID=ID)
