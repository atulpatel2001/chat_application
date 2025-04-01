import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{
          scale: [0.8, 1, 0.8],
          rotate: [0, 360],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-20 h-20 flex items-center justify-center"
      >
        {/* Glowing Ring Loader */}
        <div className="absolute inset-0 animate-ping w-full h-full rounded-full border-4 border-blue-500 opacity-50"></div>
        <div className="w-16 h-16 border-t-4 border-blue-500 border-opacity-70 rounded-full animate-spin"></div>
        <div className="absolute w-8 h-8 bg-blue-500 rounded-full blur-lg opacity-50"></div>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
