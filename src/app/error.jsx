"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log error to an error reporting service if needed
    // eslint-disable-next-line no-console
    console.error("Global error boundary captured:", error);
  }, [error]);

  return (
    <Box
      className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 dark:from-zinc-900 dark:to-zinc-950"
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingX={2}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 3, backdropFilter: "blur(6px)" }}
        >
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              gutterBottom
            >
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary">
              An unexpected error occurred. You can try again, or go back to the
              dashboard.
            </Typography>

            {error?.message ? (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: 2,
                  width: "100%",
                  bgcolor: "rgba(244,67,54,0.06)",
                  color: "error.main",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={String(error.message)}
              >
                {String(error.message)}
              </Typography>
            ) : null}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 2 }}
            >
              <Button
                onClick={() => reset()}
                variant="contained"
                color="primary"
                size="large"
              >
                Try again
              </Button>
              <Button
                component={Link}
                href="/dashboard"
                variant="outlined"
                size="large"
              >
                Go to Dashboard
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
