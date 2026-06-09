import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "94763432913";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const WhatsAppButton = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:animate-none transition-all duration-200 animate-vibrate"
    style={{
      background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
    }}
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-7 h-7 text-white" fill="white" strokeWidth={1.5} />
  </a>
);

export default WhatsAppButton;
