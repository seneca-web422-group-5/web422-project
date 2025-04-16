import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import HomePagecss from '../styles/HomePagecss.css'
import { useNavigate } from 'react-router-dom'

const HeroCarousel = ({ recipes }) => {
  const navigate = useNavigate()

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop
      className="random-swiper mb-4"
    >
      {recipes.map((recipe) => (
        <SwiperSlide key={recipe.id}>
          <div
            className="random-recipe bg-secondary p-4 mt-4 d-flex flex-column flex-md-row align-items-center"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            style={{ cursor: 'pointer' }}
          >
            {recipe.thumbnail_url && (
              <img
                src={recipe.thumbnail_url}
                alt={recipe.name}
                className="img-fluid mb-3 mb-md-0 me-md-4"
                style={{ maxWidth: '300px', borderRadius: '8px' }}
              />
            )}
            <div className="random-recipe-info">
              <h2 className="mb-5">Try this amazing recipe!</h2>
              <h2 className="display-6">{recipe.name}</h2>
              <p className="text-muted">{recipe.description || 'Try this amazing recipe!'}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default HeroCarousel
