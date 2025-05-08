import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CarIcon } from "lucide-react";
import type { Car } from "@/interfaces";

interface CarCardProps {
  car: Car;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CarCard = ({ car, onEdit, onDelete }: CarCardProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  const modelName = isRTL ? car.carModelAr : car.carModelEn;
  const brandName = isRTL ? car.carBrandAr : car.carBrandEn;

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-start gap-3 mb-4">
              <CarIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-primary">
                  {brandName} {modelName}
                </h3>
                <Badge variant="outline" className="mt-1">
                  {car.carPlateNo}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <p className="font-medium text-muted-foreground">
                {t("carColor")}
              </p>
              <div
                className="w-6 h-6 rounded-full border shadow-sm"
                style={{ backgroundColor: car.carColorEn }}
                aria-label={`Color: ${car.carColorEn}`}
              />
            </div>
          </div>

          <div className="flex md:flex-col justify-end gap-2 p-4 md:p-6 bg-muted/20 md:border-l">
            <Button
              variant="outline"
              size="lg"
              className="flex-1  max-w-[150px]"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              {t("edit")}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="flex-1  max-w-[150px]"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("delete")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
