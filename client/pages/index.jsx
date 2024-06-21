import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Typography, Box, Card, CardContent, CardMedia, Divider, IconButton, Button, Grid, Tooltip } from '@mui/material';
import { Share, ArrowForward } from '@mui/icons-material';
import { UserContext } from '../context';
import articles from '../pages/articles'; // Importing articles

const Home = () => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const handleContributorClick = () => {
    router.push('/contribution');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h1" className="text-4xl text-center mt-8 mb-4">DAILY UPDATES</Typography>
      <Typography variant="h6" className="text-center mb-4">Your contribution can make a huge impact on society</Typography>
      <div className="flex justify-center mb-4">
        <Button
          variant="contained"
          onClick={handleContributorClick}
          sx={{ 
            backgroundColor: 'black', 
            py: 1, 
            px: 2, 
            borderRadius: '8px', 
            '&:hover': { 
              backgroundColor: 'gray', 
              transform: 'scale(1.05)',
              transition: 'transform 0.3s'
            } 
          }}
        >
          <Typography variant="h6" className="text-center">Become a contributor</Typography>
        </Button>
      </div>
      <Divider sx={{ borderColor: 'black', mb: 4 }} />
      <div id="article-section" className="mt-8">
        <Grid container spacing={4}>
          {articles.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                marginBottom: '20px', 
                boxShadow: 3, 
                borderRadius: '12px', 
                transition: 'transform 0.3s', 
                '&:hover': { transform: 'scale(1.02)' },
                overflow: 'hidden'
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={article.urlToImage}
                  alt={article.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ padding: '16px' }}>
                  <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(article.publishedAt).toDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {article.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Tooltip title="Share">
                      <IconButton
                        aria-label="share"
                        onClick={() => {
                          navigator.clipboard.writeText(article.url);
                          alert("Link copied to clipboard!");
                        }}
                        sx={{ color: 'black' }}
                      >
                        <Share />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Read more">
                      <IconButton
                        aria-label="read-more"
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'black' }}
                      >
                        <ArrowForward />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Home;
