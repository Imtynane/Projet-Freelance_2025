import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

function Testimonials() {
  const testimonials = [
    {
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Grâce à StudyMate, je suis beaucoup plus organisée.",
      name: "Sarah L.",
    },
    {
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Mes dépenses sont mieux gérées grâce à StudyMate.",
      name: "Jackson Lee",
    },
    {
      img: "https://randomuser.me/api/portraits/men/65.jpg",
      text: "Mon emploi du temps n'est plus aussi chaotique.",
      name: "Aboubacar S.",
    },
  ]

  return (
    <section className="py-16 bg-gray-100">
      <h2 className="text-3xl font-bold text-center text-gray-900">
        Ce que disent les étudiants
      </h2>

      <div className="mt-10 max-w-4xl mx-auto px-6">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="pb-10"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="p-8 bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-20 h-20 rounded-full mx-auto transform hover:scale-110 transition-transform duration-300"
                />
                <p className="mt-4 text-gray-600 italic">"{t.text}"</p>
                <h3 className="mt-2 font-semibold text-gray-900">{t.name}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Testimonials
