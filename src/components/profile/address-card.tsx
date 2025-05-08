import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserAddress } from "@/interfaces";

interface AddressCardProps {
  address: UserAddress;
  onEdit: () => void;
  onDelete: () => void;
}

const AddressCard = ({ address, onEdit, onDelete }: AddressCardProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";
  const [formattedAddress, setFormattedAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to get human-readable address from coordinates
    const getAddressFromCoordinates = async () => {
      if (!address.latitude || !address.longitude) {
        setLoading(false);
        return;
      }

      try {
        // Using Nominatim OpenStreetMap API (free, no API key required)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${address.latitude}&lon=${address.longitude}&accept-language=${currentLang}`
        );
        const data = await response.json();

        if (data && data.display_name) {
          setFormattedAddress(data.display_name);
        } else {
          setFormattedAddress(t("addressNotFound"));
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setFormattedAddress(t("errorFetchingAddress"));
      } finally {
        setLoading(false);
      }
    };

    getAddressFromCoordinates();
  }, [address.latitude, address.longitude, currentLang, t]);

  // Create Google Maps link
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`;

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-primary">
                  {address.addressTitle}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? address.cityAr : address.cityEn || address.cityAr},{" "}
                  {isRTL
                    ? address.districtAr
                    : address.districtEn || address.districtAr}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-medium text-muted-foreground mb-1">
                {t("location")}
              </p>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <div className="text-sm">
                  <p className="mb-2">{formattedAddress}</p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center gap-1 hover:underline text-xs"
                  >
                    {t("viewOnGoogleMaps")} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex md:flex-col justify-end gap-2 p-4 md:p-6 bg-muted/20 md:border-l">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 md:w-24"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              {t("edit")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 md:w-24"
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

export default AddressCard;
