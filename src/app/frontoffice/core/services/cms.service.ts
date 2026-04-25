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
      emoji: '🔬',
      excerpt:
        'Investigadores de la facultad de medicina presentan resultados de su estudio sobre diagnóstico asistido por IA.',
      featured: false,
      authors: ['Dra. María López'],
      views: 1250,
      tags: ['inteligencia artificial', 'medicina', 'diagnóstico'],
    },
    {
      id: '2',
      title: 'Exposición fotográfica en el campus conmemora los 150 años.',
      category: 'cultura',
      date: '5 Mar 2026',
      readingTime: 3,
      emoji: '🏛️',
      excerpt:
        'Una muestra de 200 fotografías históricas recorre la historia de la universidad desde su fundación.',
      featured: false,
      authors: ['Departamento de Cultura'],
      views: 860,
      tags: ['fotografía', 'historia', 'universidad'],
    },
    {
      id: '3',
      title: 'Sistema CMS Web oficialmente por la Facultad de CCMM.',
      category: 'tecnologia',
      date: '1 Mar 2026',
      readingTime: 4,
      emoji: '🚀',
      excerpt:
        'El nuevo portal centraliza la información académica de todas las facultades en una sola plataforma.',
      featured: false,
      authors: ['Ing. Carlos Zambrano'],
      views: 980,
      tags: ['cms', 'web', 'tecnología'],
    },
    {
      id: '4',
      title: 'Portal del Conocimiento Académico de la Universidad',
      category: 'tecnologia',
      date: '10 Mar 2026',
      readingTime: 6,
      emoji: '🎓',
      excerpt:
        'Accede a investigaciones, eventos y noticias de todas las facultades en un solo lugar.',
      featured: true,
      authors: ['Equipo de Desarrollo'],
      views: 1500,
      tags: ['portal', 'educación', 'plataforma'],
    },

    // ========== INVESTIGACIÓN (Control prenatal) ==========
    {
      id: 'cp-1',
      title: 'Control prenatal: la importancia del seguimiento médico',
      category: 'investigacion',
      date: '15 Abr 2026',
      readingTime: 5,
      emoji: '🤰',
      excerpt:
        'El control prenatal regular reduce riesgos y asegura un embarazo saludable. Conoce las etapas y exámenes necesarios.',
      featured: false,
      authors: ['Dra. Ana Torres'],
      views: 1120,
      tags: ['embarazo', 'control prenatal', 'salud materna'],
    },
    {
      id: 'cp-2',
      title: 'Nutrición durante el embarazo: alimentos recomendados',
      category: 'investigacion',
      date: '10 Abr 2026',
      readingTime: 4,
      emoji: '🥗',
      excerpt:
        'Una alimentación balanceada es clave para el desarrollo del bebé. Descubre qué nutrientes no pueden faltar.',
      featured: false,
      authors: ['Nut. Laura Mendoza'],
      views: 980,
      tags: ['nutrición', 'embarazo', 'alimentación'],
    },

    // ========== TECNOLOGÍA (Ecografías) ==========
    {
      id: 'eco-1',
      title: 'Ecografías 2D, 3D y 4D: ¿cuál es la diferencia?',
      category: 'tecnologia',
      date: '12 Abr 2026',
      readingTime: 4,
      emoji: '👶',
      excerpt:
        'Conoce los tipos de ecografía disponibles y en qué momento del embarazo se recomienda cada una.',
      featured: false,
      authors: ['Dr. Jorge Paredes'],
      views: 1340,
      tags: ['ecografía', 'embarazo', 'tecnología médica'],
    },
    {
      id: 'eco-2',
      title: 'Ecografía Doppler: evaluando la salud fetal',
      category: 'tecnologia',
      date: '8 Abr 2026',
      readingTime: 5,
      emoji: '💓',
      excerpt:
        'Esta ecografía especializada permite evaluar el flujo sanguíneo del bebé y detectar posibles complicaciones.',
      featured: false,
      authors: ['Dr. Luis Herrera'],
      views: 1210,
      tags: ['doppler', 'salud fetal', 'ecografía'],
    },

    // ========== CULTURA (Parto humanizado) ==========
    {
      id: 'ph-1',
      title: 'Parto humanizado: respetando tus decisiones',
      category: 'cultura',
      date: '8 Abr 2026',
      readingTime: 6,
      emoji: '🌸',
      excerpt:
        'Un enfoque que prioriza el bienestar emocional y físico de la madre durante el trabajo de parto.',
      featured: false,
      authors: ['Dra. Patricia Gómez'],
      views: 890,
      tags: ['parto', 'humanizado', 'bienestar'],
    },
    {
      id: 'ph-2',
      title: 'Plan de parto: cómo preparar tus preferencias',
      category: 'cultura',
      date: '4 Abr 2026',
      readingTime: 5,
      emoji: '📋',
      excerpt:
        'Documenta tus deseos para el momento del parto: posiciones, acompañante, analgesia y más.',
      featured: false,
      authors: ['Lic. Andrea Ruiz'],
      views: 760,
      tags: ['plan de parto', 'embarazo', 'decisiones'],
    },

    // ========== EVENTOS (Consultas y cuidados) ==========
    {
      id: 'ev-1',
      title: 'Señales de trabajo de parto: cuándo ir al hospital',
      category: 'eventos',
      date: '5 Abr 2026',
      readingTime: 5,
      emoji: '🚑',
      excerpt:
        'Aprende a identificar las contracciones verdaderas y otros signos que indican que el parto se acerca.',
      featured: false,
      authors: ['Dr. Miguel Sánchez'],
      views: 1100,
      tags: ['parto', 'hospital', 'señales'],
    },
    {
      id: 'ev-2',
      title: 'Cuidados postparto: recuperación y bienestar',
      category: 'eventos',
      date: '2 Abr 2026',
      readingTime: 4,
      emoji: '🛌',
      excerpt:
        'Consejos para una recuperación saludable después del parto: alimentación, descanso y cuidados íntimos.',
      featured: false,
      authors: ['Dra. Elena Castro'],
      views: 970,
      tags: ['postparto', 'recuperación', 'salud'],
    },

    // ========== PROYECTOS (Especialistas y programas) ==========
    {
      id: 'py-1',
      title: 'Lactancia materna: beneficios para mamá y bebé',
      category: 'proyectos',
      date: '3 Abr 2026',
      readingTime: 4,
      emoji: '🤱',
      excerpt:
        'La OMS recomienda lactancia exclusiva los primeros 6 meses. Conoce todos sus beneficios.',
      featured: false,
      authors: ['Dra. Sofía Morales'],
      views: 1400,
      tags: ['lactancia', 'bebé', 'salud'],
    },
    {
      id: 'py-2',
      title: 'Programa de acompañamiento emocional perinatal',
      category: 'proyectos',
      date: '1 Abr 2026',
      readingTime: 5,
      emoji: '💚',
      excerpt:
        'Apoyo psicológico especializado para madres durante el embarazo, parto y postparto.',
      featured: false,
      authors: ['Psic. Valeria Núñez'],
      views: 880,
      tags: ['emocional', 'embarazo', 'apoyo'],
    }
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

  searchArticles(query: string): Observable<Article[]> {
  const q = query.toLowerCase().trim();

  if (!q) {
    return of(this.mockArticles);
  }

  const result = this.mockArticles.filter((article) => {
    const searchText = `
      ${article.title}
      ${article.category}
      ${article.excerpt || ''}
      ${(article.authors || []).join(' ')}
      ${(article.tags || []).join(' ')}
      ${article.views || ''}
    `.toLowerCase();

      return searchText.includes(q);
    });

    return of(result);
  }
}
