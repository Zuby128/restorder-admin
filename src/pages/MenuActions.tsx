import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormLabel,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  styled,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Avatar,
} from "@mui/material";
import {
  BorderColor,
  CloudUpload,
  DeleteForever,
  ExpandMore,
  Save,
  RestaurantMenu,
  Category as CategoryIcon,
  Add,
} from "@mui/icons-material";
import DivisionHeader from "../components/DivisionHeader";
import { useGlobalDialog } from "../hooks/useGlobalDialog";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCategoryStore } from "../store/useCategoryStore";
import { useFoodStore } from "../store/useFoodStore";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// Form validation types
interface CategoryFormData {
  name: string;
}

// Mevcut interface'i şununla değiştir:
interface MenuFormData {
  name: string;
  price: string;
  categoryId: string;
  description?: string;
  ingredients?: string; // YENİ ALAN
  image?: File;
}
// Custom hooks for form management
const useCategoryForm = () => {
  const [formData, setFormData] = useState<CategoryFormData>({ name: "" });
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<CategoryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Kategori adı gereklidir";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Kategori adı en az 2 karakter olmalıdır";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Kategori adı en fazla 50 karakter olabilir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({ name: "" });
    setErrors({});
  }, []);

  return {
    formData,
    setFormData,
    errors,
    validateForm,
    resetForm,
  };
};

const useMenuForm = () => {
  const [formData, setFormData] = useState<MenuFormData>({
    name: "",
    price: "",
    categoryId: "",
    description: "",
    ingredients: "", // YENİ ALAN
  });
  const [errors, setErrors] = useState<Partial<MenuFormData>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<MenuFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Menu adı gereklidir";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Menu adı en az 2 karakter olmalıdır";
    }

    if (
      !formData.price.trim() ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Geçerli bir fiyat giriniz";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Kategori seçimi gereklidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      price: "",
      categoryId: "",
      description: "",
      ingredients: "", // YENİ ALAN
    });
    setErrors({});
  }, []);

  return {
    formData,
    setFormData,
    errors,
    validateForm,
    resetForm,
  };
};

// Main component
function MenuActions() {
  const { openDialog } = useGlobalDialog();

  // Store hooks
  const {
    categories,
    isLoading: categoriesLoading,
    isCreating: creatingCategory,
    isUpdating: updatingCategory,
    isDeleting: deletingCategory,
    error: categoryError,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
    clearError: clearCategoryError,
  } = useCategoryStore();

  const {
    foodsByCategory,
    isLoading: foodsLoading,
    isCreating: creatingFood,
    isUpdating: updatingFood,
    isDeleting: deletingFood,
    error: foodError,
    fetchFoodsByCategory,
    createFoodWithImage,
    editFood,
    removeFood,
    clearError: clearFoodError,
  } = useFoodStore();

  // Local state
  const [activeTab, setActiveTab] = useState<"category" | "menu">("category");
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    type: "category" | "menu" | null;
    item: any;
  }>({ open: false, type: null, item: null });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
  }>({ open: false, message: "", severity: "success" });

  // Form hooks
  const categoryForm = useCategoryForm();
  const menuForm = useMenuForm();

  // Restaurant number - ideally this would come from context or props
  const restaurantNo = "1"; // This should be dynamic

  // Effects
  useEffect(() => {
    fetchCategories(restaurantNo);
  }, [fetchCategories, restaurantNo]);

  useEffect(() => {
    categories.forEach((category) => {
      fetchFoodsByCategory(category._id);
    });
  }, [categories, fetchFoodsByCategory]);

  // Error handling
  useEffect(() => {
    if (categoryError) {
      setSnackbar({
        open: true,
        message: categoryError,
        severity: "error",
      });
      clearCategoryError();
    }
  }, [categoryError, clearCategoryError]);

  useEffect(() => {
    if (foodError) {
      setSnackbar({
        open: true,
        message: foodError,
        severity: "error",
      });
      clearFoodError();
    }
  }, [foodError, clearFoodError]);

  // Memoized values
  const isLoading = useMemo(
    () => categoriesLoading || foodsLoading,
    [categoriesLoading, foodsLoading]
  );

  const isSubmitting = useMemo(
    () => creatingCategory || updatingCategory || creatingFood || updatingFood,
    [creatingCategory, updatingCategory, creatingFood, updatingFood]
  );

  // Event handlers
  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: "category" | "menu") => {
      setActiveTab(newValue);
    },
    []
  );

  const handleCategorySubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!categoryForm.validateForm()) return;

      try {
        await addCategory(categoryForm.formData.name);
        categoryForm.resetForm();
        setSnackbar({
          open: true,
          message: "Kategori başarıyla eklendi",
          severity: "success",
        });
      } catch (error) {
        // Error is handled by useEffect
      }
    },
    [categoryForm, addCategory]
  );

  const handleMenuSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!menuForm.validateForm()) return;

      try {
        const formData = new FormData();
        formData.append("name", menuForm.formData.name);
        formData.append("price", menuForm.formData.price);
        formData.append("categoryId", menuForm.formData.categoryId);
        if (menuForm.formData.description) {
          formData.append("description", menuForm.formData.description);
        }
        if (menuForm.formData.ingredients) {
          formData.append("ingredients", menuForm.formData.ingredients);
        }
        formData.append("restaurantNo", restaurantNo);

        if (menuForm.formData.image) {
          formData.append("image", menuForm.formData.image);
        }

        await createFoodWithImage(formData);
        await fetchFoodsByCategory(menuForm.formData.categoryId, true);
        menuForm.resetForm();
        setSnackbar({
          open: true,
          message: "Menu başarıyla eklendi",
          severity: "success",
        });
      } catch (error) {
        // Error is handled by useEffect
      }
    },
    [menuForm, createFoodWithImage, restaurantNo]
  );

  const handleCategoryDelete = useCallback(
    (category: any) => {
      openDialog(
        "Kategori Sil",
        `${category.name} isimli kategoriyi silmek istediğinizden emin misiniz?`,
        {
          text: "Kategoriyi Sil",
          onClick: async () => {
            try {
              await removeCategory(category._id);
              setSnackbar({
                open: true,
                message: "Kategori başarıyla silindi",
                severity: "success",
              });
            } catch (error) {
              // Error is handled by useEffect
            }
          },
        }
      );
    },
    [openDialog, removeCategory]
  );

  const handleMenuDelete = useCallback(
    (menu: any) => {
      openDialog(
        "Menu Sil",
        `${menu.name} isimli menüyü silmek istediğinizden emin misiniz?`,
        {
          text: "Menüyü Sil",
          onClick: async () => {
            try {
              await removeFood(menu._id);
              setSnackbar({
                open: true,
                message: "Menu başarıyla silindi",
                severity: "success",
              });
            } catch (error) {
              // Error is handled by useEffect
            }
          },
        }
      );
    },
    [openDialog, removeFood]
  );

  const handleEditDialogOpen = useCallback(
    (type: "category" | "menu", item: any) => {
      setEditDialog({ open: true, type, item });
    },
    []
  );

  const handleEditDialogClose = useCallback(() => {
    setEditDialog({ open: false, type: null, item: null });
  }, []);

  const handleEditSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!editDialog.item) return;

      try {
        if (editDialog.type === "category") {
          await editCategory(editDialog.item._id, editDialog.item.name);
          setSnackbar({
            open: true,
            message: "Kategori başarıyla güncellendi",
            severity: "success",
          });
        } else if (editDialog.type === "menu") {
          const formData = new FormData();
          formData.append("name", editDialog.item.name);
          formData.append("price", editDialog.item.price.toString());

          await editFood(editDialog.item._id, formData);
          setSnackbar({
            open: true,
            message: "Menu başarıyla güncellendi",
            severity: "success",
          });
        }

        handleEditDialogClose();
      } catch (error) {
        // Error is handled by useEffect
      }
    },
    [editDialog, editCategory, editFood, handleEditDialogClose]
  );

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, type: "menu") => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setSnackbar({
            open: true,
            message: "Dosya boyutu 5MB'dan küçük olmalıdır",
            severity: "error",
          });
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setSnackbar({
            open: true,
            message: "Sadece resim dosyaları yüklenebilir",
            severity: "error",
          });
          return;
        }

        menuForm.setFormData((prev) => ({ ...prev, image: file }));
      }
    },
    [menuForm]
  );

  // Loading state
  if (isLoading && categories.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <DivisionHeader header="Menu Yönetimi" />

      <Grid container spacing={2}>
        {/* Form Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ background: "#fff" }}>
            <CardContent>
              <Box sx={{ width: "100%" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="menu management tabs"
                >
                  <Tab value="category" label="Kategori" />
                  <Tab value="menu" label="Menu" />
                </Tabs>
              </Box>

              {/* Category Form */}
              <Box
                role="tabpanel"
                hidden={activeTab !== "category"}
                sx={{ mt: 2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CategoryIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" className="roboto-condensed">
                    Kategori Ekle
                  </Typography>
                </Box>

                <form onSubmit={handleCategorySubmit}>
                  <FormControl
                    sx={{ mb: 2 }}
                    fullWidth
                    error={!!categoryForm.errors.name}
                  >
                    <FormLabel htmlFor="categoryName" color="success">
                      Kategori Adı <span style={{ color: "#f44336" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="categoryName"
                      name="categoryName"
                      required
                      fullWidth
                      size="small"
                      placeholder="Örn: Ana Yemekler, Tatlılar..."
                      value={categoryForm.formData.name}
                      onChange={(e) =>
                        categoryForm.setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      error={!!categoryForm.errors.name}
                      helperText={categoryForm.errors.name}
                      disabled={isSubmitting}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Add />
                      )
                    }
                    fullWidth
                    disabled={
                      isSubmitting || !categoryForm.formData.name.trim()
                    }
                    sx={{
                      py: 1.5,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {isSubmitting ? "Kaydediliyor..." : "Kategori Ekle"}
                  </Button>
                </form>
              </Box>

              {/* Menu Form */}
              <Box role="tabpanel" hidden={activeTab !== "menu"} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <RestaurantMenu sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" className="roboto-condensed">
                    Menu Ekle
                  </Typography>
                </Box>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{
                    mb: 2,
                    textTransform: "none",
                    borderStyle: "dashed",
                  }}
                  fullWidth
                  disabled={isSubmitting}
                >
                  {menuForm.formData.image
                    ? "Resim Seçildi ✓"
                    : "Menu Resmi Yükle (Opsiyonel)"}
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "menu")}
                  />
                </Button>

                <form onSubmit={handleMenuSubmit}>
                  <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!menuForm.errors.name}
                  >
                    <FormLabel htmlFor="menuName" color="success">
                      Menu Adı <span style={{ color: "#f44336" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="menuName"
                      name="menuName"
                      required
                      fullWidth
                      size="small"
                      placeholder="Örn: Adana Kebap, Baklava..."
                      value={menuForm.formData.name}
                      onChange={(e) =>
                        menuForm.setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      error={!!menuForm.errors.name}
                      helperText={menuForm.errors.name}
                      disabled={isSubmitting}
                    />
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel htmlFor="description" color="success">
                      Açıklama (Opsiyonel)
                    </FormLabel>
                    <TextField
                      id="description"
                      name="description"
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      placeholder="Menu hakkında kısa açıklama..."
                      value={menuForm.formData.description}
                      onChange={(e) =>
                        menuForm.setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel htmlFor="ingredients" color="success">
                      İçindekiler (Opsiyonel)
                    </FormLabel>
                    <TextField
                      id="ingredients"
                      name="ingredients"
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      placeholder="Örn: Domates, marul, soğan, et..."
                      value={menuForm.formData.ingredients}
                      onChange={(e) =>
                        menuForm.setFormData((prev) => ({
                          ...prev,
                          ingredients: e.target.value,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                  </FormControl>

                  <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!menuForm.errors.price}
                  >
                    <FormLabel htmlFor="price" color="success">
                      Menu Fiyatı <span style={{ color: "#f44336" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="price"
                      name="price"
                      required
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="0.00"
                      inputProps={{ min: 0, step: "0.01" }}
                      value={menuForm.formData.price}
                      onChange={(e) =>
                        menuForm.setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      error={!!menuForm.errors.price}
                      helperText={menuForm.errors.price}
                      disabled={isSubmitting}
                      InputProps={{
                        endAdornment: (
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            TL
                          </Typography>
                        ),
                      }}
                    />
                  </FormControl>

                  <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!menuForm.errors.categoryId}
                  >
                    <FormLabel htmlFor="categorySelect" color="success">
                      Kategori <span style={{ color: "#f44336" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="categorySelect"
                      select
                      required
                      fullWidth
                      size="small"
                      value={menuForm.formData.categoryId}
                      onChange={(e) =>
                        menuForm.setFormData((prev) => ({
                          ...prev,
                          categoryId: e.target.value,
                        }))
                      }
                      error={!!menuForm.errors.categoryId}
                      helperText={
                        menuForm.errors.categoryId ||
                        (categories.length === 0
                          ? "Önce kategori eklemelisiniz"
                          : "")
                      }
                      disabled={isSubmitting || categories.length === 0}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">
                        {categories.length === 0
                          ? "Kategori bulunamadı"
                          : "Kategori Seçiniz"}
                      </option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </TextField>
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Add />
                      )
                    }
                    fullWidth
                    disabled={isSubmitting || categories.length === 0}
                    sx={{
                      py: 1.5,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {isSubmitting ? "Kaydediliyor..." : "Menu Ekle"}
                  </Button>
                </form>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Categories and Menus Display */}
        <Grid size={{ xs: 12, md: 8 }}>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <Accordion
                key={category._id}
                sx={{
                  background: "#fff",
                  mb: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:before": { display: "none" },
                  "&.Mui-expanded": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 3,
                    py: 2,
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        mr: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <CategoryIcon />
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                        className="roboto-condensed"
                      >
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {foodsByCategory[category._id]?.length || 0} menu
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                      <Tooltip title="Kategoriyi Düzenle">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditDialogOpen("category", category);
                          }}
                          disabled={updatingCategory}
                          sx={{
                            bgcolor: "primary.50",
                            "&:hover": { bgcolor: "primary.100" },
                          }}
                        >
                          <BorderColor
                            sx={{ fontSize: 18, color: "primary.main" }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Kategoriyi Sil">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryDelete(category);
                          }}
                          disabled={deletingCategory}
                          sx={{
                            bgcolor: "error.50",
                            "&:hover": { bgcolor: "error.100" },
                          }}
                        >
                          <DeleteForever
                            sx={{ fontSize: 18, color: "error.main" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </AccordionSummary>

                <Divider />

                <AccordionDetails sx={{ p: 0 }}>
                  {foodsByCategory[category._id]?.length > 0 ? (
                    <List sx={{ width: "100%" }}>
                      {foodsByCategory[category._id].map((menu, menuIndex) => (
                        <ListItem
                          key={menu._id}
                          sx={{
                            py: 2,
                            px: 3,
                            borderBottom:
                              menuIndex <
                              foodsByCategory[category._id].length - 1
                                ? "1px solid"
                                : "none",
                            borderColor: "divider",
                            "&:hover": {
                              bgcolor: "grey.50",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            {menu.imageUrl ? (
                              <Box
                                component="img"
                                src={menu.imageUrl}
                                alt={menu.name}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  objectFit: "cover",
                                  mr: 2,
                                  border: "2px solid",
                                  borderColor: "grey.200",
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <Avatar
                                sx={{
                                  width: 60,
                                  height: 60,
                                  mr: 2,
                                  bgcolor: "grey.200",
                                  color: "grey.600",
                                }}
                              >
                                <RestaurantMenu />
                              </Avatar>
                            )}

                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, mb: 0.5 }}
                              >
                                {menu.name}
                              </Typography>
                              {menu.description && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1, lineHeight: 1.4 }}
                                >
                                  {menu.description}
                                </Typography>
                              )}
                              {menu?.ingredients && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    mb: 1,
                                    lineHeight: 1.4,
                                    fontStyle: "italic",
                                    display: "block",
                                  }}
                                >
                                  İçindekiler:{" "}
                                  {(menu?.ingredients as string[])?.map(
                                    (v, i) => (
                                      <Chip key={`${i}v`} label={v} />
                                    )
                                  )}
                                </Typography>
                              )}
                              <Chip
                                label={`${menu.price} TL`}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </Box>

                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Tooltip title="Menu Düzenle">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleEditDialogOpen("menu", menu)
                                  }
                                  disabled={updatingFood}
                                  sx={{
                                    bgcolor: "primary.50",
                                    "&:hover": { bgcolor: "primary.100" },
                                  }}
                                >
                                  <BorderColor
                                    sx={{ fontSize: 18, color: "primary.main" }}
                                  />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Menu Sil">
                                <IconButton
                                  size="small"
                                  onClick={() => handleMenuDelete(menu)}
                                  disabled={deletingFood}
                                  sx={{
                                    bgcolor: "error.50",
                                    "&:hover": { bgcolor: "error.100" },
                                  }}
                                >
                                  <DeleteForever
                                    sx={{ fontSize: 18, color: "error.main" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                      <RestaurantMenu
                        sx={{ fontSize: 48, color: "grey.300", mb: 2 }}
                      />
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        Bu kategoride henüz menu bulunmuyor
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sol panelden yeni menu ekleyebilirsiniz
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Card
              sx={{
                p: 6,
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CategoryIcon sx={{ fontSize: 64, color: "grey.300", mb: 3 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Henüz kategori eklenmemiş
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Menu yönetimini başlatmak için ilk kategoriyi oluşturun
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setActiveTab("category")}
                sx={{
                  textTransform: "none",
                  px: 3,
                }}
              >
                İlk Kategoriyi Ekle
              </Button>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={handleEditDialogClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {},
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          {editDialog.type === "category" && editDialog.item && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <CategoryIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Kategori Düzenle
                </Typography>
              </Box>

              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                  Kategori Adı
                </FormLabel>
                <TextField
                  fullWidth
                  size="medium"
                  placeholder="Kategori adını giriniz"
                  value={editDialog.item.name || ""}
                  onChange={(e) =>
                    setEditDialog((prev) => ({
                      ...prev,
                      item: { ...prev.item, name: e.target.value },
                    }))
                  }
                  disabled={isSubmitting}
                />
              </FormControl>
            </Box>
          )}

          {editDialog.type === "menu" && editDialog.item && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <RestaurantMenu sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Menu Düzenle
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                    Menu Adı
                  </FormLabel>
                  <TextField
                    fullWidth
                    size="medium"
                    placeholder="Menu adını giriniz"
                    value={editDialog.item.name || ""}
                    onChange={(e) =>
                      setEditDialog((prev) => ({
                        ...prev,
                        item: { ...prev.item, name: e.target.value },
                      }))
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                    Açıklama
                  </FormLabel>
                  <TextField
                    fullWidth
                    size="medium"
                    multiline
                    rows={3}
                    placeholder="Menu açıklamasını giriniz"
                    value={editDialog.item.description || ""}
                    onChange={(e) =>
                      setEditDialog((prev) => ({
                        ...prev,
                        item: { ...prev.item, description: e.target.value },
                      }))
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                    İçindekiler
                  </FormLabel>
                  <TextField
                    fullWidth
                    size="medium"
                    multiline
                    rows={3}
                    placeholder="İçindekiler listesini giriniz"
                    value={editDialog.item.ingredients || ""}
                    onChange={(e) =>
                      setEditDialog((prev) => ({
                        ...prev,
                        item: { ...prev.item, ingredients: e.target.value },
                      }))
                    }
                    disabled={isSubmitting}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                    Menu Fiyatı
                  </FormLabel>
                  <TextField
                    fullWidth
                    size="medium"
                    type="number"
                    placeholder="0.00"
                    inputProps={{ min: 0, step: "0.01" }}
                    value={editDialog.item.price || ""}
                    onChange={(e) =>
                      setEditDialog((prev) => ({
                        ...prev,
                        item: {
                          ...prev.item,
                          price: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    disabled={isSubmitting}
                    InputProps={{
                      endAdornment: (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", mr: 1 }}
                        >
                          TL
                        </Typography>
                      ),
                    }}
                  />
                </FormControl>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Save />
              )
            }
            sx={{
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              minWidth: 120,
            }}
          >
            {isSubmitting ? "Güncelleniyor..." : "Güncelle"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleEditDialogClose}
            disabled={isSubmitting}
            sx={{
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              minWidth: 100,
            }}
          >
            İptal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default React.memo(MenuActions);
