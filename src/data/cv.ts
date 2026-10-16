// Contenu du CV : c'est le seul fichier à modifier pour mettre le site à jour.
// Règle de confidentialité : ne pas citer CERBERE ni de détail de sécurité propre à un client.

export interface Experience {
  title: string;
  company: string;
  location: string;
  /** Format AAAA-MM */
  start: string;
  /** Format AAAA-MM, absent = poste actuel */
  end?: string;
  summary: string;
  highlights?: string[];
  activities?: string[];
  results?: string[];
  stack: string[];
  domain?: string[];
}

export interface Education {
  title: string;
  school: string;
  url?: string;
  location: string;
  period: string;
  details?: string;
}

export interface Project {
  title: string;
  url: string;
  summary: string;
  stack: string[];
}

export const cv = {
  name: 'Christopher Bouthemy',
  headline: 'Développeur DevOps',
  focus: ['Automatisation', 'CI/CD', 'Supervision'],
  bio: [
    "Issu d'une reconversion professionnelle réussie, je suis développeur principal sur les outils de supervision applicative du PSIN (Ministère de la Transition Écologique et Solidaire). J'y interviens seul sur l'ensemble du cycle de vie des produits : conception, développement, mise en production et monitoring.",
    "Autonome, rigoureux et sensible à la sécurité, j'aime transformer un besoin d'exploitation en solution fiable, documentée et transmissible. Je reste curieux et en progression constante, avec des bases en développement full-stack (Java, Spring, Angular).",
  ],
  keyFigures: [
    { value: '350', label: 'applications supervisées en production par des scénarios utilisateur Playwright' },
    { value: '½ j → 5 min', label: "pour déployer l'outil de supervision sur 10 à 15 VM" },
    { value: '10 k€', label: "d'économies par an grâce à l'offre de test mobile" },
  ],
  contact: {
    email: 'bouthemy.christopher@gmail.com',
    linkedin: 'https://linkedin.com/in/christopher-bouthemy-9741b0185',
    github: 'https://github.com/Newborshian',
  },
  experiences: [
    {
      title: 'Développeur principal DevOps, supervision applicative et automatisation',
      company: 'PSIN, Ministère de la Transition Écologique et Solidaire',
      location: "L'Isle-d'Abeau",
      start: '2025-06',
      summary:
        "Développeur principal, et seul développeur, sur les outils de supervision du PSIN : maintenance, conception, mise en production et monitoring.",
      results: [
        "Offre de test d'applications mobiles Android et iOS livrée de bout en bout, en production depuis un an, pour 10 k€ d'économies par an",
        "Déploiement de l'outil de supervision sur 10 à 15 VM passé d'une demi-journée à environ 5 minutes",
        'Continuité de la supervision des 350 applications assurée lors de la migration vers une authentification forte',
        "Production alignée sur le dépôt de référence (iso-prod), avec l'historique de chaque changement",
        'Méthodes de travail uniformisées : toute modification de scénario est relue et tracée dans GitLab avant sa mise en supervision',
      ],
      activities: [
        "Tierce maintenance applicative de l'outil de supervision web, qui rejoue des scénarios utilisateur Playwright sur 350 applications, pour garantir sa disponibilité auprès des exploitants",
        "Conception, architecture, développement, mise en production et monitoring de l'offre de supervision mobile (Appium, émulateurs Android en virtualisation imbriquée, appareils iOS réels avec Xcode)",
        'Adaptation de la sonde à une authentification forte (certificats clients, double authentification)',
        'Chaînes CI sur GitLab et déploiement automatisé avec Ansible (Windows, Linux, macOS)',
        "Conception, avec un administrateur système, d'environnements de travail nominatifs et d'une pré-production ; revue des scénarios par merge request",
        "Centralisation des journaux et amélioration de la gestion des secrets",
        "Page web d'inventaire de l'infrastructure",
        "Formation de l'équipe et d'un alternant, documentation technique, revues de code",
      ],
      stack: ['Node.js', 'Playwright', 'Perl', 'Appium', 'ADB', 'Xcode', 'GitLab CI', 'Ansible', 'Windows', 'Linux', 'macOS'],
    },
    {
      title: 'Concepteur développeur',
      company: 'SEIITRA Réseau',
      location: 'Montbonnot-Saint-Martin',
      start: '2024-01',
      end: '2025-01',
      summary:
        "Tierce maintenance applicative du logiciel Thetrawin en production, évolutions réglementaires (DSN, cycle de paie) et fonctionnalités destinées au nouveau logiciel Powimo.",
      results: [
        'Développement de nouvelles fonctionnalités et correction de bugs',
        "Analyses d'impact et documentation",
        'Collaboration entre deux équipes et revues de code',
      ],
      stack: ['Unify Vision', 'Oracle SQL', 'Linux', 'TortoiseSVN', 'Jira', 'Confluence', 'Agile'],
      domain: ['Cadre réglementaire', 'Paie et DSN', 'Gestion immobilière (gérance, syndic)'],
    },
    {
      title: 'Concepteur développeur',
      company: 'Open Group',
      location: 'Montbonnot-Saint-Martin',
      start: '2023-10',
      end: '2024-01',
      summary:
        "Développement full-stack de BibliOpen, application interne qui référence les ressources sur l'agilité de l'agence de Grenoble.",
      results: [
        "Système d'authentification par JWT avec Spring Security",
        'Tests unitaires côté back-end (JUnit, Mockito)',
        'Estimation en planning poker, revues de code et démonstrations',
      ],
      stack: ['Angular 16', 'Spring Boot', 'Java', 'PostgreSQL', 'Liquibase', 'GitLab', 'Scrum'],
    },
  ] satisfies Experience[],
  skills: [
    { group: 'CI/CD et automatisation', items: ['GitLab CI', 'Ansible', 'Git', 'Scripts Perl et Node.js'] },
    { group: 'Supervision et tests', items: ['Supervision applicative', 'Playwright', 'Appium', 'ADB', 'Xcode', 'Émulateurs Android'] },
    { group: 'Systèmes', items: ['Linux', 'Windows', 'macOS', 'Virtualisation'] },
    { group: 'Développement', items: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'Node.js', 'Astro'] },
    { group: 'Données', items: ['PostgreSQL', 'Oracle SQL', 'Liquibase'] },
    { group: 'Méthodes', items: ['Revue de code', 'Documentation', 'Agile Scrum', 'Formation'] },
  ],
  projects: [
    {
      title: 'Site d’un cabinet d’ergothérapie',
      url: 'https://la-tour-ergo.fr',
      summary:
        "Site d'une ergothérapeute libérale : présentation, prestations, prise de rendez-vous et assistant de questions-réponses basé sur l'API Claude.",
      stack: ['Astro', 'Vercel (serverless)', 'API Claude'],
    },
  ] satisfies Project[],
  education: [
    {
      title: "Concepteur développeur d'applications Java full-stack (titre RNCP niveau 6)",
      school: 'Diginamic',
      url: 'https://www.diginamic.fr/',
      location: 'À distance',
      period: '2023',
    },
    {
      title: 'Master Infectiologie cellulaire et moléculaire',
      school: 'UFR des sciences pharmaceutiques, Université de Tours',
      location: 'Tours',
      period: '',
    },
    {
      title: 'Licence Biologie santé',
      school: 'UFR sciences et techniques, Université de Tours',
      location: 'Tours',
      period: '',
      details: 'Option Virologie et stratégie moléculaire d’étude de la cellule',
    },
  ] satisfies Education[],
  languages: [
    { name: 'Français', level: 'Langue maternelle' },
    { name: 'Anglais', level: 'B2 (niveau académique)' },
  ],
};
