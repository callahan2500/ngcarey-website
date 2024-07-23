---
title: "Are Dave Portnoy's Pizza Reviews Becoming More Generous?"
description: "This article explores whether Dave Portnoy's One Bite Pizza reviews have become more generous."
publishDate: "23 July 2024"
tags: ["data science"]
coverImage:
  src: "./article_cover.png"
  alt: "Article Cover Dave with Pizza"

draft: false
---

If you spend any time on the internet, then you probably have heard of Dave Portnoy. The founder of [Barstool Sports](https://www.barstoolsports.com/), he’s also a prolific pizza reviewer. Since 2013, Portnoy has reviewed nearly 2,000 pizzerias and his [videos](https://www.youtube.com/@OneBitePizzaReviews) regularly gain hundreds of thousands of views. 

Portnoy’s ‘One Bite’ reviews can also transform the fate of small businesses. Last year, Portnoy gave the obscure West Palm Beach pizzeria Ah-Beetz a “monster score” of an 8.4. Today, Ah-Beetz still sees [long lines](https://www.miaminewtimes.com/restaurants/barstool-pizza-david-portnoy-praises-ah-beetz-in-delray-beach-16639968) and is opening up [four new locations](https://ah-beetz.com/ah-beetz-locations/) to keep up with demand. 

I’m a longtime viewer of Portnoy’s reviews. The videos are entertaining and I use them to find good pizza. Recently, I’ve noticed a growing sentiment amongst the Youtube comments – Portnoy’s reviews have gone soft. Dave used to issue “real” scores back in the day. Now? He’s a lot more generous and giving mostly 7’s. 

!["Comments from Youtube"](./dave_comments_yt.png)

While it’s best to ignore Youtube comments, they made me curious: _**has the way Portnoy scores pizza changed?**_

Suppose his scoring has become more generous. Today’s 7.1 is yesterday’s 6.8. For pizzeria’s with older reviews, it means they’re being unfairly compared. There could be hundreds of great restaurants being overlooked simply because their review was done years ago. 

In this article, I analyzed Portnoy's scoring consistency to determine whether his scores have become more generous.

### Collecting the data
Before I could start, I needed a dataset of scores. To my surprise, I could not find an existing dataset. So, I went to the source: the [OneBite website](https://onebite.app/reviews/dave). After reviewing the Terms & Conditions, I used a python script to collect the following information from every review:

1. Pizzeria Name
2. Address
3. Dave's Score
4. OneBite Community Score
5. Number of Community Reviews
6. Dave's Review Date

Next, I removed reviews from 2013 through 2015 and 2024 because they had less than 50 reviews or were an incomplete year. Then, I added a ‘Score Difference’ which measured the difference between the Community Score and Portnoy’s Score.

### Are Portnoy's scores getting higher?
My first step was determining if Portnoy’s scores have changed over time. Plot 1 displays Portnoy’s average score per year, along with error bars. The larger the error bar, the more frequent extreme values, like 2's or 9's, occurred that year. 

!["Portnoy's Average Pizza Score per Year"](./average_ds_per_year.png)

Indeed, Portnoy’s average score increased. The average score in 2023 was nearly 14% higher than the 2016 average score. Additionally, there’s the matter of the error bars, with a noticeable difference in their size before and after 2020. When comparing key statistics, the post-2020 shift becomes more obvious:

|                   | 2016-2019 | 2020-2023 | Change (%) |
|:------------------|:---------:|:---------:|:----------:|
| Average Score     |   6.82    |    7.30   |  +7.03%    |
| Standard Deviation|   1.57    |    0.82   |  -47.77%   |
| Variance          |   2.46    |    0.68   |  -72.36%   |
| Most Common Score |   6.7     |    7.3    |  +8.96%    |

It appeared that, yes, Portnoy is scoring pizza’s differently: since 2020, he's been giving out higher and less extreme (variable) scores. 

But the change the shift in variability made me suspicious. Even considering the pandemic, I expected to see at least by 2023 the variance returning to its pre-2020 level. But that didn’t happen. Something is making Portnoy’s scores higher and less extreme. 

Before I could claim Portnoy's scores had become more generous, I needed to figure out what was causing this shift.

### What caused Portnoy's scoring shift?

I started watching his videos to see if I could find evidence of what was causing the shift. Over the course of a week, I watched 120 reviews and took notes on what I observed.

The videos told an interesting story. Most reviews between 2016 and 2017 were located in NYC. Occasionally, Portnoy alluded to how he found the [spot](https://onebite.app/restaurant/norma-new-york-ny-3be6fd2e). Generally, this was via a friend, an internet comment, or sometimes it appeared like the pizzeria was just along the way to where he was going. Essentially, it felt random. 

Contrast that with his post-2020 reviews. New York City reviews became less common, replaced with trips to different states like Florida or areas known for their pizza like Connecticut. In several videos, Portnoy would ask his assistant how he found the pizzeria, to which he’d often answered it was through the One Bite App.

I wanted to verify if this shift in review location may have had an affect on the average score. Plot 2 breaks down reviews by their locations per year. 

!["Review Location by Year"](./count_of_reviews_by_state.png)

Sure enough, review location closely correlated with the observed shift in average score. Between 2016 and 2019, the majority of reviews were in NYC. After 2020, the share of NYC-based reviews halved and never returned. Meanwhile, states like Florida and New Jersey saw increases in their share of reviews.

Does this mean Florida and New Jersey have better pizza than New York? No, at least I don’t think so. Instead, I believe this is evidence of **selection bias**. 

[Selection Bias](https://sph.unc.edu/wp-content/uploads/sites/112/2015/07/nciph_ERIC13.pdf) is a type of bias caused by the way data is selected. In a perfect world, Portnoy would select pizzerias randomly to help control for factors that might influence the score. As observed in the videos, the selection process in earlier years appeared to be more random.

Today's selection process appears to be less random. Based on the videos I watched, here’s how I believe Portnoy’s selection now works:

It generally begins with Portnoy taking a trip, perhaps to Florida. Dave is less familiar with these areas and, as his popularity has grown, he's become focused on trying the "best" (this is a conjecture, I don't know this for sure). So Portnoy has his assistant use the OneBite App to find and select the area's pizzerias with the highest Community Score. Therefore, it suggests the score increase observed in Plot 1 isn’t from Portnoy being more generous or 'being off his game'. Instead, it means his assistant is picking higher quality pizzerias to review. 

This assumption is supported by Plot 3, which plots the distribution of pizzeria Community Scores for 2016-2019 and 2020-2023. The post-2020 period has a higher concentration, or density, of restaurants with a higher Community Score whereas 2016-2019 has less and is more spread out. 

!["Restaurant Quality Distribution"](./kde_plot_restaurant_quality.png)


### So, are Portnoy's Scores consistent?

The change in the selection process meant I needed to control for pizzeria quality. By finding a benchmark independent of quality, I could measure the relative change between it and Portnoy's Pizza Score to see if his scoring has shifted over time. 

Thankfully, there was the Community Score: a composite of individual OneBite user scores. My hypothesis was simple: if Portnoy’s scoring has been consistent, I would expect to see no change in the _difference_ the Community Score and his. Conversely, if his scoring _has_ become more generous, then I'd expect to see an increasing difference emerge.

To illustrate this, imagine two pizzerias with an equal Community Score. One pizzeria was reviewed by Dave in 2016 while the other in 2023. If Portnoy's scoring is consistent, then the value of both score differences should be nearly same. However, if his scoring has become more generous overtime, then we'd see a positive score difference for the 2023 pizzeria.

!["Score Difference Meaning"](./score_difference_trends_and_meaning.png)

We can extend this example to the data. Plot 4 shows a line plot of the score difference (in green) for each review over time. To measure the change in difference, I included a linear-fit trendline. A positive slope would indicate Portnoy is becoming more generous, while a negative slope would suggest he is becoming less so.

!["Score Difference over Time"](./difference_between_cs_and_ds.png)

The trendline is effectively flat, hovering around Score Difference of 0.50. This suggests Portnoy's scoring has not become more generous. Instead, he has remained consistent in spite of underlying changes in how the pizzeria's are selected.

### Conclusion
Dave Portnoy has been reviewing pizza almost every day since 2013. In this analysis, I showed any perceived changes in Portnoy's scoring likely stemmed from the way he and his team pick spots to review. And even when this bias was controlled for by comparing his scores with the Community Score, Dave Portnoy still demonstrated remarkable consistency. 

This is good news for us who use the OneBite App to find good pizza. While you may not agree with Portnoy’s taste, you can be confident that a Portnoy 7.1 from 2016 should be close to the same as one from 2023.

Plus, we can definitively ignore those pesky Youtube comments, but you are probably wiser than me and knew that already.  




#### Appendix A: Resources

- [Github](https://github.com/callahan2500/pizza)
- [One Bite Website](https://onebite.app/reviews/dave)

#### Appendix B: Community Score Note
In this analysis, I used the Community Score as a benchmark. You might be asking, "well, what if the Community Score had also become more generous over time"? You'd be right to ask that question. This analysis assumes Community Scores remained intrinsicially consistent and had not become more generous over time. Here are a few reasons that I believe justify this assumption:

1. Composite Nature: The Community Score is an average of multiple individual scores, reducing the influence of any single individual.
2. Temporal Spread: Reviews contributing to the Community Scores are spread out over time. 
3. Statistical Significance: 75% of Community Scores are based on at least 17 or more reviews. 

#### Appendix C: Stats stuff for nerds
I made a few decisions in this analysis that I'd like to explain for those of you interested in my approach.

1. Error Bars: In Plot 1, I opted to use standard deviation to create my error bars instead of standard error because I wanted to emphasize the variability in pizza scores.
2. Mean instead of Median: Median can sometimes be a better descriptive statistic than mean because it is less affected by outliers. However, just like the error bars, I wanted to demonstrate that the score data was highly variable and the Mean plot made that more obvious. Additionally, people are more likely to intuitively understand what the mean is and I wanted to ensure someone without a statistics background could understand the findings.
3. Yearly Mean v. Monthly: Plot 1 measured the annual mean. I decided to use Year as the aggregate to keep the plot clean. A quick note - during my preliminary analysis I observed some interesting seasonality affects on the monthly mean, so maybe one day I'll do a followup analysis.
4. Sampling: My analysis measured 1,410 reviews. This was less than the 1,737 reviews Dave had completed by the time I pulled the data (7/22/2024). The difference is mostly from the removal of 2013-2015 and 2024 reviews, but my web-scraper did miss approximately 10% of reviews. This was due to how the scraper navigated the website. The scraper would search through each 'fan favorites' page, where it would search for pizzeria's that had both a Portnoy & Community Score. Since I couldn't rank pizzerias by whether they had both scores, the scraper had to iterate through the thousands of pages. This took forever and had diminishing returns as the later pages had less pizzerias that fit my criteria. So, I stopped the scraping once I hit 90% of all reviews.





