import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Class 12 Student, Delhi',
    avatar: '👩‍🎓',
    content: 'Understanding the human heart was so difficult from textbooks. With the 3D model, I could see how blood flows through each chamber. My biology scores improved by 30%!',
    rating: 5,
  },
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Physics Teacher, Chennai',
    avatar: '👨‍🏫',
    content: 'The collaboration feature is amazing. I can guide my students through complex wave mechanics in real-time. Teaching has never been this engaging.',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    role: 'Engineering Student, Mumbai',
    avatar: '👩‍💻',
    content: 'The engine cutaway models helped me understand thermodynamics concepts that I had been struggling with for months. Absolutely game-changing!',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-display-md font-bold mb-4">
            Loved by <span className="gradient-text">Learners</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what students and educators are saying about their 3D learning experience.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl p-8 hover-lift relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-xp text-xp" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
