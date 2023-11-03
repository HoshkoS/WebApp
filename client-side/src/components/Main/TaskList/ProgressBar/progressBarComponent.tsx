import { Box, CircularProgress, CircularProgressProps, Typography } from "@mui/material";

export default function ProgressBar(
    props: CircularProgressProps & { value: number | undefined },
  ) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress sx={{color:'white'}} {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom:5,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="white"
          >{props.value && `${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }
