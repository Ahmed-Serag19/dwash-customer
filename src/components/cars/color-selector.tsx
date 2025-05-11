// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import axios from "axios";
// import { apiEndpoints } from "@/constants/endPoints";

// interface Color {
//   carColorId: number;
//   colorAr: string;
//   colorEn: string;
// }

// interface ColorSelectorProps {
//   selectedColorId: number;
//   onChange: (colorId: number) => void;
// }

// const ColorSelector = ({ selectedColorId, onChange }: ColorSelectorProps) => {
//   const { t, i18n } = useTranslation();
//   const [colors, setColors] = useState<Color[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Map color IDs to actual hex values for display
//   const colorValueMap: Record<number, string> = {
//     3: "#ffffff", // White
//     4: "#000000", // Black
//     1: "#808080", // Gray
//     2: "#c0c0c0", // Silver
//     5: "#0000ff", // Blue
//     6: "#ff0000", // Red
//     7: "#a52a2a", // Brown
//     8: "#f5f5dc", // Beige
//     9: "#008000", // Green
//     10: "#ffa500", // Orange
//   };

//   useEffect(() => {
//     const fetchColors = async () => {
//       try {
//         const response = await axios.get(apiEndpoints.getCarColor);
//         if (response.data.success) {
//           setColors(response.data.content || []);
//         }
//       } catch (error) {
//         console.error("Error fetching colors:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchColors();
//   }, []);

//   if (loading) {
//     return <div>{t("loading")}</div>;
//   }

//   return (
//     <div className="flex flex-wrap gap-3 max-w-lg px-5">
//       {colors.map((color) => (
//         <button
//           key={color.carColorId}
//           type="button"
//           className={`xl:w-10 xl:h-10 md:h-7 md:w-7 h-5 w-5 rounded-full border-[1px] border-primary ${
//             selectedColorId === color.carColorId
//               ? "ring-2 ring-offset-2 ring-primary"
//               : ""
//           }`}
//           style={{ backgroundColor: colorValueMap[color.carColorId] }}
//           onClick={() => onChange(color.carColorId)}
//           title={i18n.language === "ar" ? color.colorAr : color.colorEn}
//           aria-label={i18n.language === "ar" ? color.colorAr : color.colorEn}
//         />
//       ))}
//     </div>
//   );
// };

// export default ColorSelector;

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { Skeleton } from "@/components/ui/skeleton";

interface Color {
  carColorId: number;
  colorAr: string;
  colorEn: string;
}

interface ColorSelectorProps {
  selectedColorId: number;
  onChange: (colorId: number) => void;
  disabled?: boolean;
}

const ColorSelector = ({
  selectedColorId,
  onChange,
  disabled = false,
}: ColorSelectorProps) => {
  const { i18n } = useTranslation();
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);

  // Map color IDs to actual hex values for display
  const colorValueMap: Record<number, string> = {
    3: "#ffffff", // White
    4: "#000000", // Black
    1: "#808080", // Gray
    2: "#c0c0c0", // Silver
    5: "#0000ff", // Blue
    6: "#ff0000", // Red
    7: "#a52a2a", // Brown
    8: "#f5f5dc", // Beige
    9: "#008000", // Green
    10: "#ffa500", // Orange
  };

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(apiEndpoints.getCarColor);
        if (response.data.success) {
          setColors(response.data.content || []);
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3">
        {[...Array(10)].map((_, index) => (
          <Skeleton key={index} className="w-8 h-8 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 p-1">
      {colors.map((color) => (
        <button
          key={color.carColorId}
          type="button"
          className={`w-8 h-8 rounded-full border ${
            selectedColorId === color.carColorId
              ? "ring-2 ring-offset-2 ring-primary"
              : "border-gray-300"
          } ${
            disabled
              ? "opacity-60 cursor-not-allowed"
              : "hover:ring-1 hover:ring-offset-1 hover:ring-gray-400"
          }`}
          style={{ backgroundColor: colorValueMap[color.carColorId] }}
          onClick={() => !disabled && onChange(color.carColorId)}
          title={i18n.language === "ar" ? color.colorAr : color.colorEn}
          aria-label={i18n.language === "ar" ? color.colorAr : color.colorEn}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default ColorSelector;
