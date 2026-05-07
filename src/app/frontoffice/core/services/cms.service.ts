import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article, ArticleCategory } from '../models/article.model';
import { Page } from '../models/page.model';
import { GalleryItem } from '../models/block.model';

@Injectable({ providedIn: 'root' })
export class CmsService {
  private mockArticles: Article[] = [
    // ========== ARTÍCULOS ORIGINALES DEL PORTAL ==========
    {
      id: '1',
      title: 'Nuevos avances en inteligencia artificial aplicada a la medicina.',
      category: 'investigacion',
      date: '8 Mar 2026',
      readingTime: 5,
      paragraphs: [
        'Un equipo de investigadores de la facultad de medicina ha desarrollado un sistema de inteligencia artificial que mejora el diagnóstico de enfermedades complejas.',
        'El sistema utiliza algoritmos de aprendizaje profundo para analizar grandes volúmenes de datos médicos y proporcionar recomendaciones precisas a los profesionales de la salud.',
        'Los resultados preliminares muestran una mejora significativa en la precisión diagnóstica, lo que podría traducirse en tratamientos más efectivos para los pacientes.',
      ],
      emoji: '🔬',
      excerpt:
        'Investigadores de la facultad de medicina presentan resultados de su estudio sobre diagnóstico asistido por IA.',
      featured: false,
    },
    {
      id: '2',
      title: 'Exposición fotográfica en el campus conmemora los 150 años.',
      category: 'cultura',
      date: '5 Mar 2026',
      readingTime: 3,
      paragraphs: [
        'Una muestra de 200 fotografías históricas recorre la historia de la universidad desde su fundación.',
        'La exposición incluye imágenes inéditas de eventos clave, personajes destacados y momentos memorables que han marcado el desarrollo de la institución.',
        'La muestra estará abierta al público durante todo el mes de marzo en la sala de exposiciones del campus.',
      ],
      emoji: '🏛️',
      excerpt:
        'Una muestra de 200 fotografías históricas recorre la historia de la universidad desde su fundación.',
      featured: false,
    },
    {
      id: '3',
      title: 'Sistema CMS Web oficialmente por la Facultad de CCMM.',
      category: 'tecnologia',
      date: '1 Mar 2026',
      paragraphs: [
        'La Facultad de Ciencias Médicas ha lanzado su nuevo sistema de gestión de contenidos (CMS) para mejorar la comunicación y difusión de información académica.',
        'El CMS permite a las facultades publicar noticias, eventos, investigaciones y otros contenidos relevantes de manera ágil y centralizada.',
        'Con esta herramienta, se busca fortalecer la presencia digital de la universidad y facilitar el acceso a información actualizada para estudiantes, docentes y público en general.',
      ],
      readingTime: 4,
      emoji: '🚀',
      excerpt:
        'El nuevo portal centraliza la información académica de todas las facultades en una sola plataforma.',
      featured: false,
    },
    {
      id: '4',
      title: 'Portal del Conocimiento Académico de la Universidad',
      category: 'tecnologia',
      date: '10 Mar 2026',
      readingTime: 6,
      paragraphs: [
        'La universidad ha lanzado el Portal del Conocimiento Académico, una plataforma digital que centraliza toda la información académica de las facultades.',
        'El portal ofrece acceso a investigaciones, eventos, noticias y recursos educativos de todas las disciplinas, facilitando la colaboración y el intercambio de conocimientos entre estudiantes y docentes.',
        'Con una interfaz intuitiva y funcionalidades avanzadas, el portal se posiciona como una herramienta clave para potenciar el aprendizaje y la investigación en la comunidad universitaria.',
      ],
      emoji: '🎓',
      excerpt:
        'Accede a investigaciones, eventos y noticias de todas las facultades en un solo lugar.',
      featured: true,
    },

    // ========== INVESTIGACIÓN (Control prenatal) ==========
    {
      id: 'cp-1',
      title: 'Control prenatal: la importancia del seguimiento médico',
      category: 'investigacion',
      date: '15 Abr 2026',
      readingTime: 5,
      emoji: '🤰',
      paragraphs: [
        'El control prenatal regular es fundamental para garantizar un embarazo saludable y detectar posibles complicaciones a tiempo.',
        'Durante las visitas prenatales, se realizan exámenes físicos, ecografías y análisis de laboratorio para monitorear el desarrollo del bebé y la salud de la madre.',
        'Es importante seguir las recomendaciones médicas y asistir a todas las citas programadas para asegurar el bienestar tanto de la madre como del bebé.',
      ],
      excerpt:
        'El control prenatal regular reduce riesgos y asegura un embarazo saludable. Conoce las etapas y exámenes necesarios.',
      featured: false,
    },
    {
      id: 'cp-2',
      title: 'Nutrición durante el embarazo: alimentos recomendados',
      category: 'investigacion',
      date: '10 Abr 2026',
      paragraphs: [
        'Una alimentación balanceada durante el embarazo es clave para el desarrollo del bebé y la salud de la madre.',
        'Se recomienda consumir una variedad de alimentos ricos en nutrientes como frutas, verduras, proteínas magras, lácteos y granos enteros.',
        'Es importante evitar alimentos procesados, altos en azúcares y grasas saturadas, y consultar con un profesional de la salud para recibir orientación personalizada.',
      ],
      readingTime: 4,
      emoji: '🥗',
      excerpt:
        'Una alimentación balanceada es clave para el desarrollo del bebé. Descubre qué nutrientes no pueden faltar.',
      featured: false,
    },

    // ========== TECNOLOGÍA (Ecografías) ==========
    {
      id: 'eco-1',
      title: 'Ecografías 2D, 3D y 4D: ¿cuál es la diferencia?',
      category: 'tecnologia',
      date: '12 Abr 2026',
      readingTime: 4,
      paragraphs: [
        'Las ecografías 2D son las más comunes y ofrecen imágenes en blanco y negro del bebé, mientras que las ecografías 3D proporcionan imágenes tridimensionales que permiten ver detalles faciales y corporales con mayor claridad.',
      ],
      emoji: '👶',
      excerpt:
        'Conoce los tipos de ecografía disponibles y en qué momento del embarazo se recomienda cada una.',
      featured: false,
    },
    {
      id: 'eco-2',
      title: 'Ecografía Doppler: evaluando la salud fetal',
      category: 'tecnologia',
      date: '8 Abr 2026',
      paragraphs: [
        'La ecografía Doppler es una técnica especializada que permite evaluar el flujo sanguíneo del bebé y detectar posibles complicaciones.',
        'Esta técnica utiliza ondas sonoras para medir la velocidad y dirección del flujo sanguíneo, lo que ayuda a identificar problemas como la restricción del crecimiento fetal o la preeclampsia.',
      ],
      readingTime: 5,
      emoji: '💓',
      excerpt:
        'Esta ecografía especializada permite evaluar el flujo sanguíneo del bebé y detectar posibles complicaciones.',
      featured: false,
    },

    // ========== CULTURA (Parto humanizado) ==========
    {
      id: 'ph-1',
      title: 'Parto humanizado: respetando tus decisiones',
      category: 'cultura',
      date: '8 Abr 2026',
      paragraphs: [
        'El parto humanizado es un enfoque que prioriza el bienestar emocional y físico de la madre durante el trabajo de parto.',
        'Este enfoque promueve la participación activa de la mujer en las decisiones sobre su parto, respetando sus preferencias y necesidades individuales.',
        'El objetivo es crear un ambiente de apoyo y confianza que favorezca una experiencia de parto positiva y empoderadora para la madre.',
      ],
      readingTime: 6,
      emoji: '🌸',
      excerpt:
        'Un enfoque que prioriza el bienestar emocional y físico de la madre durante el trabajo de parto.',
      featured: false,
    },
    {
      id: 'ph-2',
      title: 'Plan de parto: cómo preparar tus preferencias',
      category: 'cultura',
      date: '4 Abr 2026',
      readingTime: 5,
      paragraphs: [
        'El plan de parto es un documento que permite a las futuras madres expresar sus preferencias y deseos para el momento del parto.',
      ],
      emoji: '📋',
      excerpt:
        'Documenta tus deseos para el momento del parto: posiciones, acompañante, analgesia y más.',
      featured: false,
    },

    // ========== EVENTOS (Consultas y cuidados) ==========
    {
      id: 'ev-1',
      title: 'Señales de trabajo de parto: cuándo ir al hospital',
      category: 'eventos',
      date: '5 Abr 2026',
      readingTime: 5,
      paragraphs: [
        'Es fundamental reconocer las señales de trabajo de parto para saber cuándo es el momento adecuado para dirigirse al hospital.',
        'Las contracciones regulares, la ruptura de aguas y la pérdida del tapón mucoso son algunos de los signos que indican que el parto se acerca.',
        'Si experimentas alguno de estos síntomas, es importante contactar a tu médico o dirigirte al hospital para recibir atención adecuada.',
      ],
      emoji: '🚑',
      excerpt:
        'Aprende a identificar las contracciones verdaderas y otros signos que indican que el parto se acerca.',
      featured: false,
    },
    {
      id: 'ev-2',
      title: 'Cuidados postparto: recuperación y bienestar',
      category: 'eventos',
      date: '2 Abr 2026',
      readingTime: 4,
      paragraphs: [
        'El período postparto es una etapa de recuperación física y emocional para la madre, que requiere cuidados especiales.',
        'Es importante descansar lo suficiente, mantener una alimentación balanceada y recibir apoyo emocional durante esta etapa.',
        'Además, es fundamental cuidar la salud íntima y estar atenta a cualquier signo de complicación para buscar atención médica si es necesario.',
      ],
      emoji: '🛌',
      excerpt:
        'Consejos para una recuperación saludable después del parto: alimentación, descanso y cuidados íntimos.',
      featured: false,
    },

    // ========== PROYECTOS (Especialistas y programas) ==========
    {
      id: 'py-1',
      title: 'Lactancia materna: beneficios para mamá y bebé',
      category: 'proyectos',
      date: '3 Abr 2026',
      paragraphs: [
        'La lactancia materna exclusiva durante los primeros 6 meses de vida ofrece numerosos beneficios tanto para el bebé como para la madre.',
        'Para el bebé, la leche materna proporciona todos los nutrientes necesarios para su desarrollo, fortalece su sistema inmunológico y reduce el riesgo de enfermedades.',
        'Para la madre, la lactancia ayuda a recuperar el peso pregestacional, reduce el riesgo de cáncer de mama y ovario, y fortalece el vínculo afectivo con el bebé.',
      ],
      readingTime: 4,
      emoji: '🤱',
      excerpt:
        'La OMS recomienda lactancia exclusiva los primeros 6 meses. Conoce todos sus beneficios.',
      featured: false,
    },
    {
      id: 'py-2',
      title: 'Programa de acompañamiento emocional perinatal',
      category: 'proyectos',
      date: '1 Abr 2026',
      readingTime: 5,
      paragraphs: [
        'El programa de acompañamiento emocional perinatal ofrece apoyo psicológico especializado para madres durante el embarazo, parto y postparto.',
      ],
      emoji: '💚',
      excerpt:
        'Apoyo psicológico especializado para madres durante el embarazo, parto y postparto.',
      featured: false,
    },
  ];

  private mockContents: GalleryItem[] = [
    {
      id: 'c1',
      label: 'Ciencias de la Vida',
      emoji: '🧬',
      color: 'green',
    },
    {
      id: 'c2',
      label: 'Medio Ambiente',
      emoji: '🌱',
      color: 'pink',
    },
    {
      id: 'c3',
      label: 'Datos y Estadística',
      emoji: '📊',
      color: 'blue',
    },
  ];

  getHomePage(): Observable<Page> {
    const page: Page = {
      id: 'home',
      slug: '/',
      title: 'Inicio',
      blocks: [
        {
          id: 'b1',
          type: 'hero',
          data: {
            tag: 'Publicación Destacada',
            article: this.mockArticles.find((a) => a.featured)!,
          },
        },
        {
          id: 'b2',
          type: 'cards-grid',
          data: {
            title: 'Publicaciones Recientes',
            articles: this.mockArticles.filter((a) => !a.featured).slice(0, 6),
          },
        },
        {
          id: 'b3',
          type: 'gallery-grid',
          data: {
            title: 'Galería de Contenidos',
            items: this.mockContents,
          },
        },
      ],
    };
    return of(page);
  }

  getArticles(category?: ArticleCategory): Observable<Article[]> {
    const result = category
      ? this.mockArticles.filter((a) => a.category === category)
      : this.mockArticles;
    return of(result);
  }

  getArticleById(id: string): Observable<Article | undefined> {
    return of(this.mockArticles.find((a) => a.id === id));
  }
}
