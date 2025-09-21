"use client"

import { useLanguage } from "@/components/context/language-context"

// Simple translation dictionary
const translations = {
  en: {
    settings: "Settings",
    language: "Language",
    languageDescription: "Choose your preferred language for legal guidance and documents.",
    aiOutputStyle: "AI Output Style",
    aiOutputDescription: "Control how the AI drafts documents and responds.",
    formalTone: "Formal Tone",
    dataSharing: "Data Sharing",
    dataSharingDescription: "Help us improve by allowing anonymous usage analytics.",
    allowAnalytics: "Allow anonymous analytics",
  },
  es: {
    settings: "Configuración",
    language: "Idioma",
    languageDescription: "Elija su idioma preferido para orientación legal y documentos.",
    aiOutputStyle: "Estilo de salida de IA",
    aiOutputDescription: "Controle cómo la IA redacta documentos y responde.",
    formalTone: "Tono formal",
    dataSharing: "Compartir datos",
    dataSharingDescription: "Ayúdenos a mejorar permitiendo análisis anónimos de uso.",
    allowAnalytics: "Permitir análisis anónimos",
  },
  vi: {
    settings: "Cài đặt",
    language: "Ngôn ngữ",
    languageDescription: "Chọn ngôn ngữ ưa thích của bạn cho hướng dẫn pháp lý và tài liệu.",
    aiOutputStyle: "Kiểu đầu ra AI",
    aiOutputDescription: "Kiểm soát cách AI soạn thảo tài liệu và phản hồi.",
    formalTone: "Giọng điệu trang trọng",
    dataSharing: "Chia sẻ dữ liệu",
    dataSharingDescription: "Giúp chúng tôi cải thiện bằng cách cho phép phân tích sử dụng ẩn danh.",
    allowAnalytics: "Cho phép phân tích ẩn danh",
  },
  zh: {
    settings: "设置",
    language: "语言",
    languageDescription: "选择您偏好的法律指导和文件语言。",
    aiOutputStyle: "AI输出风格",
    aiOutputDescription: "控制AI如何起草文件和回应。",
    formalTone: "正式语调",
    dataSharing: "数据共享",
    dataSharingDescription: "允许匿名使用分析以帮助我们改进。",
    allowAnalytics: "允许匿名分析",
  },
  tl: {
    settings: "Mga Setting",
    language: "Wika",
    languageDescription: "Piliin ang iyong gustong wika para sa legal na patnubay at mga dokumento.",
    aiOutputStyle: "Istilo ng AI Output",
    aiOutputDescription: "Kontrolin kung paano gumagawa ng mga dokumento at tumutugon ang AI.",
    formalTone: "Pormal na Tono",
    dataSharing: "Pagbabahagi ng Data",
    dataSharingDescription:
      "Tulungan kaming mapabuti sa pamamagitan ng pagpapahintulot ng anonymous na analytics ng paggamit.",
    allowAnalytics: "Payagan ang anonymous na analytics",
  },
}

export function useTranslation() {
  const { currentLanguage } = useLanguage()

  const t = (key: string) => {
    const lang = currentLanguage.value as keyof typeof translations
    return (
      translations[lang]?.[key as keyof (typeof translations)[typeof lang]] ||
      translations.en[key as keyof typeof translations.en] ||
      key
    )
  }

  return { t }
}
