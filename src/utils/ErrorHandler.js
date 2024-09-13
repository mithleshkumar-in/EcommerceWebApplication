export const handleError = (error) => {
  if (error.response) {
    console.error('Error:', error.response.data.message);
  } else if (error.request) {
    console.error('Error: No response received from server');
  } else {
    console.error('Error:', error.message);
  }
};
