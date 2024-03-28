import {Typography, Box, Button} from '@mui/material'
import {createTheme, ThemeProvider} from "@mui/material";
import {LinearProgress} from '@mui/material';
import {useState} from 'react';
function App() {
  const theme = createTheme({
    palette: {
      background: {
        default: '#111111'
      },
    },
  })
  // Apply the background color to the body of the document
  document.body.style.backgroundColor = theme.palette.background.default
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [probabilities, setProbabilities] = useState([0, 0, 0, 0, 0]);

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files;
    if (file.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(file[0]);
      };
      reader.readAsDataURL(file[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      fetch('http://localhost:5001/predict', {
        method: 'POST',
        body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        setProbabilities(data.probabilities);
        setPredictions(data.predictions);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };
  
  const handleChange = (e) => {
    const file = e.target.files[0];
    setPredictions([]);
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(file);
      }
      reader.readAsDataURL(file);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Typography variant="h4" textAlign='center' color='white'>Image Classifer</Typography>
          <Typography variant="h5" textAlign='center' color='white'>Let me guess what your image is!</Typography>
          <Typography variant="h6" textAlign='center' color='white'>Click the box or drag and drop to upload an image</Typography>
          <form onSubmit={handleSubmit}>
          <Box sx={{position: 'relative', marginTop: 5, alignItems: 'center'}} onDragOver={onDragOver} onDrop={onDrop}>
              <label style={{width: '100%', height: '100%', position: 'absolute'}}>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    left: '5px',
                    opacity: 0,
                  }}
                />
              </label>
              <Box
                component="img"
                src={preview}
                alt=''
                sx={{
                  minWidth: {xs: '300px', md: '400px'},
                  minHeight: {xs: '300px', md: '400px'},
                  maxWidth: '500px',
                  maxHeight: '500px',
                  border: '5px solid #fb8500',
                }}
              />
            </Box>
            <Button sx={{
              backgroundColor: '#fb8500',
              width: '30%',
              '&:hover': {
                backgroundColor: '#fb5607',
              }
            }}
              type='submit'
            >
              <Typography color='white'>
                Submit
              </Typography>
            </Button>
          </form>
        </Box>
        <Box>
          {(predictions.length > 0) && <Typography variant='h4' color='white' alignContent='center'>
            I see...
          </Typography>}
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, width: '500px'}}>
            {(predictions && probabilities) ? predictions.map((prediction, index) => (
              <Box key={index} sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Typography variant='h6' color='white' sx={{flexGrow: 1}}>
                  {prediction} 
                </Typography>
                <Typography variant='h6' color='white' sx={{marginLeft: 1}}>
                  {Math.round(probabilities[index] * 100)}%
                </Typography>
                <LinearProgress variant='determinate' value={probabilities[index] * 100}
                  sx={{width: '300px', marginLeft: 2, color: '#fb8500'}}
                />
              </Box>
            )) : (
              Array(5).fill().map((_, index) => (
                <Box key={index} sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Typography variant='h6' color='white'>
                    Loading...
                  </Typography>
                  <LinearProgress variant='determinate' value={0} sx={{width: '300px',marginLeft: 2, color: '#fb8500'}}/>
                </Box>
              ))
            )}
          </Box> 
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
