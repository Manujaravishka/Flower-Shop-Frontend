import { motion } from "framer-motion";

interface LuxurySpinnerProps {
  size?: number;
  className?: string;
}

const LuxurySpinner = ({ size = 32, className = "" }: LuxurySpinnerProps) => {
  return (
    <div className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, #1B4332 50%, #C8A24A 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="absolute inset-[3px] rounded-full bg-cream"
        style={{ width: size - 6, height: size - 6 }}
      />
    </div>
  );
};

export default LuxurySpinner;
