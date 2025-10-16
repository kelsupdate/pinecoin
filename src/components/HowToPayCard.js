import * as React from 'react';
import Card from '@mui/joy/Card';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import Check from '@mui/icons-material/Check';
import { Chip } from '@mui/joy';

export default function HowToPayCard(props) {
    return (
        <Card size="lg" variant="outlined">
            <Typography level="h3">How To Pay</Typography>
            <Divider inset="none" />
            <List size="sm" sx={{ mx: 'calc(-1 * var(--ListItem-paddingX))' }}>
                <ListItem>
                    <ListItemDecorator>
                        <Check />
                    </ListItemDecorator>
                    Enter your M-PESA phone number
                </ListItem>
                <ListItem>
                    <Chip variant="soft" startDecorator={<Check />} endDecorator={<Typography fontWeight={"bold"}>Ksh {props.amount}</Typography>}>
                        Amount to pay :
                    </Chip>
                </ListItem>
                <ListItem>
                    <ListItemDecorator>
                        <Check />
                    </ListItemDecorator>
                    Click "Pay Now" to initiate STK Push
                </ListItem>
                <ListItem>
                    <ListItemDecorator>
                        <Check />
                    </ListItemDecorator>
                    Enter your M-PESA PIN on your phone
                </ListItem>
            </List>
        </Card>
    );
}
