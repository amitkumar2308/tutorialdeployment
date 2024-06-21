// pages/index.js

import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Typography, Box, Card, CardContent, CardMedia, Divider, IconButton, Button } from '@mui/material';
import { Share, ArrowForward } from '@mui/icons-material';
import { UserContext } from '../context';

const Home = () => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const currentDate = new Date().toISOString();

  const articles = [
    {
      title: "Apple Announces Selective Rollout of New AI Features",
      description: "Apple revealed its new AI suite, called Apple Intelligence, but only the iPhone 15 Pro and iPhone 15 Pro Max will receive the full range of features. Other devices will have access to some functionalities depending on their processors. Apple Intelligence leverages machine learning to comprehend and generate text and images, along with suggesting message replies and photo organization. To ensure user privacy, processing will be divided between the device and Apple's servers. This approach aims to deliver a powerful AI experience without compromising user privacy.",
      url: "https://www.indiatoday.in/technology/news/story/not-iphone-15-but-only-two-iphones-are-set-to-receive-apple-intelligence-features-this-year-2553004-2024-06-14",
      urlToImage: "https://www.the-sun.com/wp-content/uploads/sites/6/2022/09/iphone-15-op.jpg?strip=all&quality=100&w=1920&h=1080&crop=1",
      publishedAt: currentDate,
    },
    {
      title: "GTA 6 Release Date, Features, and Updates",
      description: "Rockstar Games has been building anticipation for the release of GTA 6, with various leaks and updates fueling the excitement. The game is speculated to release between April 2024 and May 2025, aligning with Take-Two Interactive's financial projections. This release is expected to generate significant revenue for the company. Key features include a return to Vice City, massive map upgrades, diverse gameplay, and initial availability on PS5 and Xbox Series X/S. A second trailer and pre-order options are expected soon.",
      url: "https://english.jagran.com/technology/gta-6-release-date-price-maps-trailer-2-leaks-characters-locations-leaked-announcement-news-rockstar-games-updates-what-to-expect-10167408",
      urlToImage: "https://images7.alphacoders.com/133/1335660.jpeg",
      publishedAt: currentDate,
    },
    {
      title: "Satya Nadella Dislikes the Term 'Artificial Intelligence'",
      description: "Microsoft CEO Satya Nadella expressed his discomfort with the term 'Artificial Intelligence,' preferring a more nuanced understanding of the technology. Nadella highlighted the importance of AI in enhancing human productivity and shared Microsoft's vision for the future of AI and sustainability.",
      url: "https://www.hindustantimes.com/business/satya-nadella-does-not-like-the-term-artificial-intelligence-i-wish-we-called-it-101718274571527.html",
      urlToImage: "https://www.hindustantimes.com/ht-img/img/2024/06/13/550x309/US-tech-Microsoft-computers-AI-2_1718274638460_1718274658014.jpg",
      publishedAt: currentDate,
    },
    {
      title: "The Role of Artificial Intelligence in Career Counselling",
      description: "The article discusses the integration of Artificial Intelligence (AI) in career counselling and highlights the distinct value that human counsellors bring to the table. It explores the emotional connect and empathy that human counsellors can provide, as well as the pros and cons of using AI in career counselling. The article also emphasizes the benefits of professional career counselling, such as personalized assistance, exploring career alternatives, and providing encouragement and practical solutions to help individuals achieve their goals. The conclusion suggests that a combination of human and AI support can offer comprehensive and effective career counselling services.",
      url: "https://www.thehindu.com/education/the-role-of-artificial-intelligence-in-career-counselling/article68275874.ece",
      urlToImage: "https://www.telstra.com.sg/content/dam/shared-component-assets/tecom/articles/managed-services-critical-to-address-singapore's-growing-it-talent-shortage/A5%20hero%20image.png",
      publishedAt: currentDate,
    },
    {
      title: "Snapdragon 6s Gen 3: Enhanced Upgrade or Mere Rebrand?",
      description: "Qualcomm recently launched the Snapdragon 6s Gen 3 mobile platform, sparking debate due to its similarities to the 2021 Snapdragon 695. The new chipset reportedly boasts improvements in CPU, GPU, and AI performance, but details remain scarce.",
      url: "https://www.gizchina.com/2024/06/15/snapdragon-6s-gen-3-enhanced-upgrade-or-mere-rebrand/",
      urlToImage: "https://theroco.com/assets/2022/08/Snapdragon-6-Gen-1-leaks.jpg",
      publishedAt: currentDate,
    },
    // Add more articles as needed
  ];

  const handleContributorClick = () => {
    router.push('/contribution');
  };

  return (
    <div className="container mx-auto px-4">
      <Typography variant="h1" className="text-4xl text-center mt-8 mb-4">DAILY UPDATES</Typography>
      <Typography variant="h6" className="text-center mb-4">Your contribution can make a huge impact on society</Typography>
      <div className="flex justify-center"> 
        <Button
          variant="contained"
          onClick={handleContributorClick}
          sx={{ backgroundColor: 'black', py: 0.5, px: 1, alignItems: 'center' }}
        >
          <Typography variant="h6" className="text-center small">Become a contributor</Typography>
        </Button>
        <Divider sx={{ borderColor: 'black' }} /> {/* Divider with black color */}
      </div>
      <div id="article-section" className="mt-8">
        {articles.map((article, index) => (
          <Card key={index} sx={{ marginBottom: '20px' }}>
            <CardMedia
              component="img"
              height="200"
              image={article.urlToImage}
              alt={article.title}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {article.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(article.publishedAt).toDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {article.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <IconButton
                  aria-label="share"
                  onClick={() => {
                    navigator.clipboard.writeText(article.url);
                    alert("Link copied to clipboard!");
                  }}
                >
                  <Share />
                </IconButton>
                <IconButton aria-label="read-more" href={article.url} target="_blank" rel="noopener noreferrer">
                  <ArrowForward />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
