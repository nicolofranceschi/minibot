import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export function BasicCard({ user, setData }: { user: User; setData: SetFunction<User | null>; }) {
  return (
    <Card sx={{ flexGrow: 1, width: 200, borderRadius: '1rem', borderStyle: "solid", borderWidth: "2px", borderColor: user.color }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {user.email}
        </Typography>
        <Typography variant="h5" component="div">
          {user.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {user.color}
        </Typography>
        <Typography variant="body2">
          {user.status}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => setData(user)}>EDIT</Button>
      </CardActions>
    </Card>
  );
}
