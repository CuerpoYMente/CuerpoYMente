import styled from "styled-components"
import colors from "../theme/colors"

function FeaturedVideos() {
  // Datos de ejemplo para los videos destacados
  const featuredVideos = [
    {
      id: 1,
      title: "Entrenamiento HIIT",
      duration: "25 min",
      thumbnail: "https://via.placeholder.com/300x200/6B4D8A/FFFFFF?text=HIIT",
    },
    {
      id: 2,
      title: "Yoga para principiantes",
      duration: "40 min",
      thumbnail: "https://via.placeholder.com/300x200/4A2B69/FFFFFF?text=Yoga",
    },
    {
      id: 3,
      title: "Cardio intenso",
      duration: "30 min",
      thumbnail: "https://via.placeholder.com/300x200/2A1A3A/FFFFFF?text=Cardio",
    },
  ]

  return (
    <FeaturedSection>
      <SectionTitle>Videos Destacados</SectionTitle>
      <VideoGrid>
        {featuredVideos.map((video) => (
          <VideoCard key={video.id}>
            <VideoThumbnail src={video.thumbnail} alt={video.title} />
            <VideoInfo>
              <VideoTitle>{video.title}</VideoTitle>
              <VideoDuration>{video.duration}</VideoDuration>
            </VideoInfo>
          </VideoCard>
        ))}
      </VideoGrid>
    </FeaturedSection>
  )
}

const FeaturedSection = styled.section`
  padding: 4rem 2rem;
  background-color: ${colors.purplePale};
  width: 100%;
  margin: 0;
`

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 2rem;
  text-align: center;
  color: ${colors.purpleDark};
  letter-spacing: 1px;
`

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const VideoCard = styled.div`
  background-color: ${colors.white};
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(42, 26, 58, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(42, 26, 58, 0.15);
  }
`

const VideoThumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`

const VideoInfo = styled.div`
  padding: 1rem;
`

const VideoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${colors.purpleDark};
`

const VideoDuration = styled.span`
  font-size: 0.9rem;
  color: ${colors.purpleLight};
`

export default FeaturedVideos
