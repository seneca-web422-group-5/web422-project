import { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);

    const handleFavoriteChange = () => {
      const updatedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(updatedFavorites);
    };

    window.addEventListener('favoriteChanged', handleFavoriteChange); // Listen for changes

    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange); // Cleanup
    };
  }, []);

  const handleRemove = (id) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Favorite Recipes ❤️</h2>
      {favorites.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <Row>
          {favorites.map((recipe) => (
            <Col key={recipe.id} sm={6} md={4} lg={3} className="mb-4">
              <Card>
                <Card.Img variant="top" src={recipe.thumbnail_url || 'default-image.jpg'} />
                <Card.Body>
                  <Card.Title>{recipe.name}</Card.Title>
                  <div className="d-flex justify-content-between">
                    <Link to={`/recipe/${recipe.id}`}>
                      <Button variant="primary" size="sm">View</Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => handleRemove(recipe.id)}>
                      Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Favorites;
