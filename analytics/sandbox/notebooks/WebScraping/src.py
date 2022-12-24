#import what we need
from requests_html import HTMLSession
session = HTMLSession()
import pandas as pd
import newspaper
import json
import geopandas as gpd


#use session to get the page
r = session.get('https://news.google.com/search?q=agriculture&hl=en-IN&gl=IN&ceid=IN%3Aen')  #agriculture telangana

#render the html, sleep=1 to give it a second to finish before moving on. scrolldown= how many times to page down on the browser, to get more results. 5 was a good number here
r.html.render(sleep=5, scrolldown=10)     # ----------------------# THIS LINE WAS FETCHING ME ERROR IN JUPYTER NOTEBOOK

#find all the articles by using inspect element and create blank list
articles = r.html.find('article')
newslist = []

#loop through each article to find the title and link. try and except as repeated articles from other sources have different h tags.
for item in articles:
    try:
        newsitem = item.find('h3', first=True)
        title = newsitem.text
        link = newsitem.absolute_links
        newsarticle = {
            'title': title,
            'link': link 
        }
        newslist.append(newsarticle)
    except:
       pass

#print the length of the list
print('List of news articles: ',len(newslist))
'''
#Create a dataframe of newslist and link
df = pd.DataFrame(newslist)


#Scrape the list of article dictionary from news list
news_articles = []
for i in df.link:
    url = list(i)[0]
    article = newspaper.Article(url=url, language='en')
    article.download()
    article.parse()

    article ={
        "title": str(article.title),
        "text": str(article.text),
        "authors": article.authors,
        "published_date": str(article.publish_date),
        "top_image": str(article.top_image),
        "videos": article.movies,
        "keywords": article.keywords,
        "summary": str(article.summary)
    }
    news_articles.append(article)

    #Convert list of news articles into dataframe with all scraped information
news = pd.DataFrame(news_articles)
text = news.text[0]

#Read geodataframe for mandal and district names to search in news articles
gdf = gpd.read_file('../DPPD/data/TSDM/Mandal_Boundary.shp')
mandal = list(gdf.Mandal_Nam.unique()) #unique mandals
dist = list(gdf.Dist_Name.unique())    #unique districts

# Access list of mandal mentione in each article

keyword_mandal = []
mandal_list = []

for text in  news.text:
    for i in range(0, len(mandal)):
        if mandal[i] in text:
            keyword_mandal.append(mandal[i])
    # insert the list to the set
        list_set = set(keyword_mandal)
    # convert the set to the list
        unique_list = (list(list_set))
    mandal_list.append(unique_list)


# Access list of district mentione in each article
keyword_dist = []
dist_list = []
for text in  news.text:
    for i in range(0, len(dist)):
        if dist[i] in text:
            keyword_dist.append(dist[i])
    # insert the list to the set
        list_set = set(keyword_dist)
    # convert the set to the list
        unique_list = (list(list_set))
    dist_list.append(unique_list)

#add mandal and districts to news dataframe
news['Mandals'] = mandal_list
news['Districts'] = dist_list

#convert full news dataframe to csv
news.to_csv('news_full.csv', index = False)

#Dataframe with few columns
news1 = news[['title','Mandals','Districts','published_date']]
news1.to_csv('news.csv', index = False)
'''