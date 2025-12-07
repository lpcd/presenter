import { useNavigate } from "react-router-dom";

interface NextModuleButtonProps {
  presentationId: string;
  module: {
    filename: string;
    title: string;
  };
}

export const NextModuleButton = ({
  presentationId,
  module,
}: NextModuleButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center py-8">
      <button
        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => {
          navigate(
            `/presentations/${presentationId}/support/${module.filename}`
          );
        }}
      >
        <span>Continuer : {module.title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3"
          />
        </svg>
      </button>
    </div>
  );
};
