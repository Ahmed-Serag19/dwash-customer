import { useTranslation } from "react-i18next";

interface ColorSelectorProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

const ColorSelector = ({ selectedColor, onChange }: ColorSelectorProps) => {
  const { t } = useTranslation();

  const colorOptions = [
    { value: "white", label: t("white") },
    { value: "silver", label: t("silver") },
    { value: "gray", label: t("gray") },
    { value: "black", label: t("black") },
    { value: "red", label: t("red") },
    { value: "orange", label: t("orange") },
    { value: "yellow", label: t("yellow") },
    { value: "gold", label: t("gold") },
    { value: "green", label: t("green") },
    { value: "lightblue", label: t("lightBlue") },
    { value: "blue", label: t("blue") },
    { value: "navy", label: t("navy") },
    { value: "purple", label: t("purple") },
    { value: "pink", label: t("pink") },
    { value: "brown", label: t("brown") },
    { value: "beige", label: t("beige") },
  ];

  return (
    <div className="flex flex-wrap gap-3 max-w-lg px-5">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          type="button"
          className={`w-10 h-10 rounded-full border-[1px] border-primary ${
            selectedColor === color.value
              ? "ring-2 ring-offset-2 ring-primary"
              : ""
          }`}
          style={{ backgroundColor: color.value }}
          onClick={() => onChange(color.value)}
          title={color.label}
          aria-label={color.label}
        />
      ))}
    </div>
  );
};

export default ColorSelector;
