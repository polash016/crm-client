import { Box, Container, Paper, Stack, Typography } from "@mui/material";

export default function GlobalLoading() {
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
            <div className="relative h-14 w-14">
              <span className="absolute inset-0 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
              <span className="absolute inset-0 rounded-full border-2 border-green-400 border-b-transparent animate-[reverse-spin_1.5s_linear_infinite]" />
            </div>
            <Typography variant="h5" component="p" fontWeight={600}>
              Loading
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we prepare your experience.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
