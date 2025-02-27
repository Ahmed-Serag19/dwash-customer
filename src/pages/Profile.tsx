import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { toast } from "react-toastify";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface City {
  cityId: number;
  cityNameAr: string;
  cityNameEn: string;
}

interface District {
  districtId: number;
  districtNameAr: string;
  districtNameEn: string;
}

const Profile = () => {
  const { user, token, getUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      name: user?.nameEn || "",
      cityId: user?.userAddressDto?.cityId?.toString() || "",
      districtId: user?.userAddressDto?.districtId?.toString() || "",
      latitude: user?.userAddressDto?.latitude || "",
      longitude: user?.userAddressDto?.longitude || "",
    },
  });

  const selectedCityId = watch("cityId");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("المتصفح لا يدعم تحديد الموقع الجغرافي");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue("latitude", latitude.toString());
        setValue("longitude", longitude.toString());
        toast.success("تم تحديد موقعك بنجاح");
        setLoadingLocation(false);
      },
      (error) => {
        console.log(error);
        toast.error("فشل تحديد الموقع، يرجى التحقق من الأذونات");
        setLoadingLocation(false);
      }
    );
  };

  useEffect(() => {
    if (user) {
      setValue("email", user.email);
      setValue("name", user.nameEn);
      setValue("cityId", user.userAddressDto?.cityId?.toString() || "");
      setValue("districtId", user.userAddressDto?.districtId?.toString() || "");
      setValue("latitude", user.userAddressDto?.latitude || "");
      setValue("longitude", user.userAddressDto?.longitude || "");
      setLoading(false);
    }
  }, [user, setValue]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(apiEndpoints.getCities);
        if (response.data.success) setCities(response.data.content);
      } catch (error) {
        toast.error("Failed to load cities");
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCityId) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            apiEndpoints.getDistrict(selectedCityId)
          );
          if (response.data.success) {
            setDistricts(response.data.content);
          }
        } catch (error) {
          toast.error("Failed to load districts");
        }
      };

      fetchDistricts();
    }
  }, [selectedCityId]);

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.put(apiEndpoints.editProfile, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(t("profileUpdated"));
        setEditMode(false);
        getUser();
      } else {
        toast.error("Update failed!");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile");
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-primary mb-6">
        الملف الشخصي
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        {/* Name */}
        <div>
          <label className="block text-gray-700">الاسم</label>
          <input
            {...register("name", { required: "الاسم مطلوب" })}
            className="w-full px-4 py-2 border rounded-lg"
            disabled={!editMode}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">البريد الإلكتروني</label>
          <input
            {...register("email", { required: "البريد الإلكتروني مطلوب" })}
            className="w-full px-4 py-2 border rounded-lg"
            disabled={!editMode}
          />
        </div>

        {/* City Dropdown */}
        <div>
          <label className="block text-gray-700">المدينة</label>
          <Controller
            name="cityId"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full px-4 py-2 border rounded-lg">
                {user?.userAddressDto?.cityAr !== null ? (
                  <option value="">{user?.userAddressDto?.cityAr}</option>
                ) : (
                  <option value="">اختر المدينة</option>
                )}

                {cities.map((city) => (
                  <option key={city.cityId} value={city.cityId}>
                    {city.cityNameAr}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.cityId && (
            <p className="text-red-500 text-sm">
              {typeof errors.cityId.message === "string"
                ? errors.cityId.message
                : "خطأ غير معروف"}
            </p>
          )}
        </div>

        {/* District Dropdown */}
        <div>
          <label className="block text-gray-700">الحي</label>
          <Controller
            name="districtId"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full px-4 py-2 border rounded-lg">
                {user?.userAddressDto?.districtAr !== null ? (
                  <option value="">{user?.userAddressDto?.districtAr}</option>
                ) : (
                  <option value="">اختر المدينة</option>
                )}
                {districts.map((district) => (
                  <option key={district.districtId} value={district.districtId}>
                    {district.districtNameAr}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.districtId && (
            <p className="text-red-500 text-sm">
              {typeof errors.districtId.message === "string"
                ? errors.districtId.message
                : "خطأ غير معروف"}
            </p>
          )}
        </div>

        {/* Coordinates */}
        <div className="flex gap-2">
          {/* Fetch Location Button */}
          <button
            type="button"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
            onClick={handleGetLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? "جاري تحديد الموقع..." : <MapPin size={20} />}
          </button>

          {/* Latitude Input */}
          <input
            {...register("latitude", { required: "الموقع مطلوب" })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="خط العرض"
          />
          {errors.latitude && (
            <p className="text-red-500 text-sm">
              {typeof errors.latitude.message === "string"
                ? errors.latitude.message
                : "خطأ غير معروف"}
            </p>
          )}

          {/* Longitude Input */}
          <input
            {...register("longitude", { required: "الموقع مطلوب" })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="خط الطول"
          />
          {errors.longitude && (
            <p className="text-red-500 text-sm">
              {typeof errors.longitude.message === "string"
                ? errors.longitude.message
                : "خطأ غير معروف"}
            </p>
          )}
        </div>
        {/* Edit & Save Buttons */}
        <div className="col-span-2 flex justify-center mt-4">
          {editMode ? (
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg"
            >
              حفظ
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg"
            >
              تعديل
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
