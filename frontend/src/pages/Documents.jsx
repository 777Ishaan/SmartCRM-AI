import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  Divider,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";
import TableChartIcon from "@mui/icons-material/TableChart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import {
  uploadDocument,
  getDocuments,
} from "../services/api";

const Documents = () => {
  // =========================================================
  // CURRENT USER / PERMISSIONS
  // =========================================================

  const storedUser = localStorage.getItem("user");

  let currentUser = null;

  try {
    currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Unable to read logged-in user:",
      error
    );
  }

  const isAdmin = currentUser?.role === "ADMIN";

  // =========================================================
  // DOCUMENTS
  // Loaded from Spring Boot
  // =========================================================

  const [documents, setDocuments] = useState([]);

  const [loadingDocuments, setLoadingDocuments] =
    useState(true);

  // =========================================================
  // LOAD DOCUMENTS FROM SPRING BOOT
  // =========================================================

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoadingDocuments(true);

      const data = await getDocuments();

      const formattedDocuments = data.map(
        (document) => ({
          ...document,

          // Convert backend file type into UI type
          type: getFileExtension(
            document.originalFileName
          ),

          // Backend returns fileSize in bytes
          size: formatFileSize(
            document.fileSize
          ),

          // Format backend date
          uploadedAt:
            formatDate(document.uploadedAt),

          // Backend currently doesn't have
          // a relatedTo text field
          relatedTo: "-",
        })
      );

      setDocuments(formattedDocuments);

    } catch (error) {
      console.error(
        "Failed to load documents:",
        error
      );

      setDocuments([]);

    } finally {
      setLoadingDocuments(false);
    }
  };

  // =========================================================
  // HELPER - FILE EXTENSION
  // =========================================================

  const getFileExtension = (fileName) => {
    if (!fileName) {
      return "FILE";
    }

    return (
      fileName
        .split(".")
        .pop()
        ?.toUpperCase() || "FILE"
    );
  };

  // =========================================================
  // HELPER - FILE SIZE
  // =========================================================

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    if (bytes >= 1024 * 1024) {
      return `${(
        bytes /
        (1024 * 1024)
      ).toFixed(1)} MB`;
    }

    return `${Math.max(
      1,
      Math.round(bytes / 1024)
    )} KB`;
  };

  // =========================================================
  // HELPER - DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  // =========================================================
  // UPLOAD DIALOG
  // =========================================================

  const [uploadDialogOpen, setUploadDialogOpen] =
    useState(false);

  const [uploadData, setUploadData] = useState({
    name: "",
    category: "General",
    relatedTo: "",
    description: "",
    file: null,
  });

  const [uploadError, setUploadError] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  // =========================================================
  // MENU
  // =========================================================

  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedDocument, setSelectedDocument] =
    useState(null);

  const menuOpen = Boolean(anchorEl);

  // =========================================================
  // VIEW DIALOG
  // =========================================================

  const [viewDialogOpen, setViewDialogOpen] =
    useState(false);

  // =========================================================
  // DELETE DIALOG
  // =========================================================

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  // =========================================================
  // DOCUMENT ICON
  // =========================================================

  const getDocumentIcon = (type) => {
    switch (type) {
      case "PDF":
        return (
          <PictureAsPdfIcon
            sx={{ color: "#dc2626" }}
          />
        );

      case "DOCX":
      case "DOC":
        return (
          <ArticleIcon
            sx={{ color: "#2563eb" }}
          />
        );

      case "XLSX":
      case "XLS":
        return (
          <TableChartIcon
            sx={{ color: "#16a34a" }}
          />
        );

      case "JPG":
      case "JPEG":
      case "PNG":
      case "WEBP":
        return (
          <ImageIcon
            sx={{ color: "#9333ea" }}
          />
        );

      default:
        return (
          <DescriptionIcon
            sx={{ color: "#6b7280" }}
          />
        );
    }
  };

  // =========================================================
  // CATEGORY COLOR
  // =========================================================

  const getCategoryColor = (category) => {
    switch (category) {
      case "Contracts":
        return "primary";

      case "Marketing":
        return "secondary";

      case "Company":
        return "info";

      case "Invoices":
        return "warning";

      case "Reports":
        return "success";

      default:
        return "default";
    }
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredDocuments = useMemo(() => {
    const searchValue =
      search.toLowerCase();

    return documents.filter(
      (document) => {
        const matchesSearch =
          (document.name || "")
            .toLowerCase()
            .includes(searchValue) ||

          (document.originalFileName || "")
            .toLowerCase()
            .includes(searchValue) ||

          (document.relatedTo || "")
            .toLowerCase()
            .includes(searchValue) ||

          (document.category || "")
            .toLowerCase()
            .includes(searchValue);

        const matchesCategory =
          categoryFilter === "All" ||
          document.category ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    documents,
    search,
    categoryFilter,
  ]);

  // =========================================================
  // OPEN UPLOAD
  // =========================================================

  const handleOpenUploadDialog = () => {
    setUploadData({
      name: "",
      category: "General",
      relatedTo: "",
      description: "",
      file: null,
    });

    setUploadError("");

    setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    if (uploading) {
      return;
    }

    setUploadDialogOpen(false);
    setUploadError("");
  };

  // =========================================================
  // UPLOAD FORM CHANGE
  // =========================================================

  const handleUploadChange = (event) => {
    const { name, value } =
      event.target;

    setUploadData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setUploadError("");
  };

  // =========================================================
  // FILE CHANGE
  // =========================================================

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0] ||
      null;

    setUploadData((prev) => ({
      ...prev,
      file,
    }));

    if (file) {
      setUploadError("");
    }
  };

  // =========================================================
  // UPLOAD DOCUMENT TO SPRING BOOT
  // =========================================================

  const handleUploadDocument = async () => {
    if (!uploadData.name.trim()) {
      setUploadError(
        "Document name is required."
      );
      return;
    }

    if (!uploadData.file) {
      setUploadError(
        "Please select a file."
      );
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      // Create multipart form data
      const data = new FormData();

      data.append(
        "file",
        uploadData.file
      );

      data.append(
        "name",
        uploadData.name
      );

      data.append(
        "category",
        uploadData.category
      );

      data.append(
        "description",
        uploadData.description || ""
      );

      // Current logged-in user
      data.append(
        "uploadedBy",
        currentUser?.name || "User"
      );

      // Send to Spring Boot
      const result =
        await uploadDocument(data);

      console.log(
        "Document uploaded:",
        result
      );

      // Format returned backend document
      const newDocument = {
        ...result,

        type: getFileExtension(
          result.originalFileName
        ),

        size: formatFileSize(
          result.fileSize
        ),

        uploadedAt:
          formatDate(
            result.uploadedAt
          ),

        relatedTo:
          uploadData.relatedTo ||
          "-",
      };

      // Add new document to table
      setDocuments((prev) => [
        newDocument,
        ...prev,
      ]);

      // Close dialog
      handleCloseUploadDialog();

    } catch (error) {
      console.error(
        "Upload failed:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      setUploadError(
        error.response?.data?.message ||
        "Failed to upload document. Please try again."
      );

    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // MENU
  // =========================================================

  const handleOpenMenu = (
    event,
    document
  ) => {
    setAnchorEl(
      event.currentTarget
    );

    setSelectedDocument(
      document
    );
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // =========================================================
  // VIEW DOCUMENT
  // =========================================================

  const handleViewDocument = () => {
    setViewDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedDocument(null);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleOpenDeleteDialog = () => {
    if (!isAdmin) {
      handleCloseMenu();
      return;
    }

    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleDeleteDocument = () => {
    if (!isAdmin) {
      return;
    }

    if (!selectedDocument) {
      return;
    }

    // IMPORTANT:
    // This currently removes from React only.
    // Backend DELETE endpoint will be connected next.
    setDocuments((prev) =>
      prev.filter(
        (document) =>
          document.id !==
          selectedDocument.id
      )
    );

    setDeleteDialogOpen(false);
    setSelectedDocument(null);
  };

  // =========================================================
  // STATS
  // =========================================================

  const totalDocuments =
    documents.length;

  const totalCategories =
    new Set(
      documents.map(
        (document) =>
          document.category
      )
    ).size;

  const uploadedByYou =
    documents.filter(
      (document) =>
        document.uploadedBy ===
        currentUser?.name
    ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box>
      {/* PAGE HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Documents
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mt: 0.5,
            }}
          >
            Store and manage
            customer-related
            documents
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <CloudUploadIcon />
          }
          onClick={
            handleOpenUploadDialog
          }
          sx={{
            textTransform:
              "none",
            borderRadius: 2,
            px: 2.5,
            py: 1.1,
            bgcolor: "#111827",
            "&:hover": {
              bgcolor: "#1f2937",
            },
          }}
        >
          Upload Document
        </Button>
      </Box>

      {/* STAT CARDS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mb: 1,
            }}
          >
            Total Documents
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {totalDocuments}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mb: 1,
            }}
          >
            Categories
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {totalCategories}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mb: 1,
            }}
          >
            Uploaded By You
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {uploadedByYou}
          </Typography>
        </Paper>
      </Box>

      {/* SEARCH / FILTER */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border:
            "1px solid #e5e7eb",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search documents..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            size="small"
            sx={{
              minWidth: 300,
              flex: 1,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color:
                        "#9ca3af",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: 180,
            }}
          >
            <InputLabel>
              Category
            </InputLabel>

            <Select
              value={
                categoryFilter
              }
              label="Category"
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
            >
              <MenuItem value="All">
                All Categories
              </MenuItem>

              <MenuItem value="Contracts">
                Contracts
              </MenuItem>

              <MenuItem value="Invoices">
                Invoices
              </MenuItem>

              <MenuItem value="Reports">
                Reports
              </MenuItem>

              <MenuItem value="Marketing">
                Marketing
              </MenuItem>

              <MenuItem value="Company">
                Company
              </MenuItem>

              <MenuItem value="General">
                General
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* DOCUMENT TABLE */}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border:
            "1px solid #e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor:
                  "#f9fafb",
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Document
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Category
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Related To
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Uploaded By
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Date
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Size
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                }}
              >
                More
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loadingDocuments ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  <Typography
                    sx={{
                      py: 5,
                      color:
                        "#6b7280",
                    }}
                  >
                    Loading documents...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {filteredDocuments.map(
                  (document) => (
                    <TableRow
                      key={
                        document.id
                      }
                      hover
                      sx={{
                        "&:last-child td":
                          {
                            borderBottom: 0,
                          },
                      }}
                    >
                      {/* DOCUMENT */}

                      <TableCell>
                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 1.5,
                          }}
                        >
                          {getDocumentIcon(
                            document.type
                          )}

                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight:
                                  600,
                                color:
                                  "#111827",
                              }}
                            >
                              {
                                document.name
                              }
                            </Typography>

                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  "#9ca3af",
                              }}
                            >
                              {
                                document.originalFileName
                              }
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* CATEGORY */}

                      <TableCell>
                        <Chip
                          label={
                            document.category
                          }
                          color={getCategoryColor(
                            document.category
                          )}
                          size="small"
                          sx={{
                            fontWeight:
                              600,
                          }}
                        />
                      </TableCell>

                      {/* RELATED */}

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "#4b5563",
                          }}
                        >
                          {
                            document.relatedTo ||
                            "-"
                          }
                        </Typography>
                      </TableCell>

                      {/* UPLOADED BY */}

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "#4b5563",
                          }}
                        >
                          {
                            document.uploadedBy
                          }
                        </Typography>
                      </TableCell>

                      {/* DATE */}

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "#4b5563",
                          }}
                        >
                          {
                            document.uploadedAt
                          }
                        </Typography>
                      </TableCell>

                      {/* SIZE */}

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "#4b5563",
                          }}
                        >
                          {
                            document.size
                          }
                        </Typography>
                      </TableCell>

                      {/* MENU */}

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(
                            event
                          ) =>
                            handleOpenMenu(
                              event,
                              document
                            )
                          }
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )}

                {filteredDocuments.length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                    >
                      <Typography
                        sx={{
                          py: 5,
                          color:
                            "#6b7280",
                        }}
                      >
                        No documents
                        found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* THREE DOT MENU */}

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={
          handleCloseMenu
        }
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem
          onClick={
            handleViewDocument
          }
        >
          <VisibilityIcon
            fontSize="small"
            sx={{
              mr: 1.5,
              color:
                "#6b7280",
            }}
          />
          View Details
        </MenuItem>

        {isAdmin && (
          <>
            <Divider />

            <MenuItem
              onClick={
                handleOpenDeleteDialog
              }
              sx={{
                color:
                  "#dc2626",
                "&:hover": {
                  bgcolor:
                    "#fef2f2",
                },
              }}
            >
              <DeleteIcon
                fontSize="small"
                sx={{
                  mr: 1.5,
                }}
              />
              Delete Document
            </MenuItem>
          </>
        )}
      </Menu>

      {/* UPLOAD DIALOG */}

      <Dialog
        open={uploadDialogOpen}
        onClose={
          handleCloseUploadDialog
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Upload Document
        </DialogTitle>

        <DialogContent
          dividers
        >
          {uploadError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
              }}
            >
              {uploadError}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Document Name"
              name="name"
              value={
                uploadData.name
              }
              onChange={
                handleUploadChange
              }
              fullWidth
              placeholder="e.g. Customer Agreement"
              disabled={uploading}
            />

            <FormControl fullWidth>
              <InputLabel>
                Category
              </InputLabel>

              <Select
                name="category"
                value={
                  uploadData.category
                }
                label="Category"
                onChange={
                  handleUploadChange
                }
                disabled={
                  uploading
                }
              >
                <MenuItem value="Contracts">
                  Contracts
                </MenuItem>

                <MenuItem value="Invoices">
                  Invoices
                </MenuItem>

                <MenuItem value="Reports">
                  Reports
                </MenuItem>

                <MenuItem value="Marketing">
                  Marketing
                </MenuItem>

                <MenuItem value="Company">
                  Company
                </MenuItem>

                <MenuItem value="General">
                  General
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Related Customer / Lead"
              name="relatedTo"
              value={
                uploadData.relatedTo
              }
              onChange={
                handleUploadChange
              }
              fullWidth
              placeholder="e.g. Acme Corporation"
              disabled={uploading}
            />

            <TextField
              label="Description"
              name="description"
              value={
                uploadData.description
              }
              onChange={
                handleUploadChange
              }
              fullWidth
              multiline
              rows={3}
              disabled={uploading}
            />

            {/* FILE SELECTOR */}

            <Box>
              <input
                type="file"
                id="document-file-input"
                hidden
                onChange={
                  handleFileChange
                }
                disabled={uploading}
              />

              <label htmlFor="document-file-input">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={
                    <CloudUploadIcon />
                  }
                  disabled={
                    uploading
                  }
                  sx={{
                    textTransform:
                      "none",
                    borderRadius: 2,
                  }}
                >
                  Choose File
                </Button>
              </label>

              {uploadData.file && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color:
                      "#4b5563",
                  }}
                >
                  Selected:{" "}
                  <strong>
                    {
                      uploadData
                        .file.name
                    }
                  </strong>
                </Typography>
              )}
            </Box>

            <Typography
              variant="caption"
              sx={{
                color:
                  "#9ca3af",
              }}
            >
              The selected file
              will be uploaded
              to the SmartCRM
              backend.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{ p: 2 }}
        >
          <Button
            onClick={
              handleCloseUploadDialog
            }
            disabled={
              uploading
            }
            sx={{
              textTransform:
                "none",
              color:
                "#6b7280",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={
              <AddIcon />
            }
            onClick={
              handleUploadDocument
            }
            disabled={
              uploading
            }
            sx={{
              textTransform:
                "none",
              bgcolor:
                "#111827",
              "&:hover": {
                bgcolor:
                  "#1f2937",
              },
            }}
          >
            {uploading
              ? "Uploading..."
              : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* VIEW DETAILS */}

      <Dialog
        open={viewDialogOpen}
        onClose={
          handleCloseViewDialog
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Document Details
        </DialogTitle>

        <DialogContent
          dividers
        >
          {selectedDocument && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                {getDocumentIcon(
                  selectedDocument.type
                )}

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight:
                        700,
                    }}
                  >
                    {
                      selectedDocument.name
                    }
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        "#6b7280",
                    }}
                  >
                    {
                      selectedDocument.originalFileName
                    }
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display:
                    "grid",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Category
                  </Typography>

                  <Box
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label={
                        selectedDocument.category
                      }
                      color={getCategoryColor(
                        selectedDocument.category
                      )}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Related To
                  </Typography>

                  <Typography>
                    {
                      selectedDocument.relatedTo ||
                      "-"
                    }
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Uploaded By
                  </Typography>

                  <Typography>
                    {
                      selectedDocument.uploadedBy
                    }
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Uploaded At
                  </Typography>

                  <Typography>
                    {
                      selectedDocument.uploadedAt
                    }
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    File Size
                  </Typography>

                  <Typography>
                    {
                      selectedDocument.size
                    }
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Description
                  </Typography>

                  <Typography>
                    {
                      selectedDocument.description ||
                      "No description added."
                    }
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{ p: 2 }}
        >
          <Button
            onClick={
              handleCloseViewDialog
            }
            variant="contained"
            sx={{
              textTransform:
                "none",
              bgcolor:
                "#111827",
              "&:hover": {
                bgcolor:
                  "#1f2937",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}

      <Dialog
        open={deleteDialogOpen}
        onClose={
          handleCloseDeleteDialog
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Delete Document?
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color:
                "#4b5563",
            }}
          >
            Are you sure you
            want to delete{" "}
            <strong>
              {
                selectedDocument?.name
              }
            </strong>
            ?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color:
                "#9ca3af",
              mt: 1,
            }}
          >
            This action cannot
            be undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{ p: 2 }}
        >
          <Button
            onClick={
              handleCloseDeleteDialog
            }
            sx={{
              textTransform:
                "none",
              color:
                "#6b7280",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={
              handleDeleteDocument
            }
            variant="contained"
            color="error"
            sx={{
              textTransform:
                "none",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Documents;