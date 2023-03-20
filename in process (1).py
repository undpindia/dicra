#!/usr/bin/env python
# coding: utf-8

# In[2]:

#task 1 code
import pandas as pd
data = pd.read_csv('testing.csv', usecols=['longitude','latitude','acq_date'])


# In[2]:


import csv


# In[3]:


import geocoder


# In[4]:


from geopy.geocoders import Nominatim
geolocator = Nominatim(user_agent="geoapiExercises")


# In[5]:


state_district_list=[]


# In[6]:


for i in range(len(data)):
# import module
# Latitude & Longitude input
    Latitude = str(data.loc[i,"latitude"])
    Longitude = str(data.loc[i,"longitude"])
  
    location = geolocator.reverse(Latitude+","+Longitude)
    address = location.raw['address']
    state_district = address.get('state_district')
    state_district_list.append(state_district)


# In[ ]:


print(state_district_list)


# In[7]:


data['state_district_list']=state_district_list


# In[ ]:





# In[8]:


data['year'] = data['acq_date'].astype(str).str.extract('(\d{4})').astype(int)


# In[ ]:





# In[9]:


grp_district = data.groupby(['state_district_list'])


# In[10]:


count = grp_district['year'].value_counts().head(20)


# In[19]:


count.to_csv('submit1 (1).csv')


# In[7]:


data = pd.read_csv('submit1 (1).csv',sep=',')


# In[9]:


fire = data.to_json('submit.json',indent =1)


# In[3]:





# In[6]:





# In[ ]:




