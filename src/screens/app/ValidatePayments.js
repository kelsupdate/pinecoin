import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import SelectedPackageDetails from '../../components/SelectedPackageDetails'
import { Alert, Button, Card, Divider, Grid, LinearProgress, Input, Typography } from '@mui/joy'
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';

import { useAtom } from 'jotai';
import { subscribedPackage } from '../../state';
import HowToPayCard from '../../components/HowToPayCard'
import Tabs from '../../components/ResponsiveAppBar'
import axios from 'axios'




export default function ValidatePayments() {
  const navigate = useNavigate()

  const [currentPackage, setCurrentPackage] = useAtom(subscribedPackage)

  const location = useLocation();
  const [progress, setProgress] = useState(false);
  const [packageItem, setPackageItem] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState(false)
  useEffect(() => {
    fetch('https://gist.githubusercontent.com/kelsupdate/9b3e12c7876cfde9ae5be3d281719be4/raw/e8edc1db7a1b4392b270fb16a9176585d359bb93/gistfile1.txt')
      .then(response => response.json())
      .then((data) => {
        const selectedPackage = data.surveyPlans[location.state.index];
        // Parse price to number for proper validation
        selectedPackage.price = parseFloat(selectedPackage.price);
        setPackageItem(selectedPackage);
        setProgress(false);
      });
  }, []);

  const [open, setOpen] = React.useState(false);

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/initiate-payment', {
        email: "user@example.com", // Placeholder, should be user's email
        amount: packageItem.price,
        phone: phoneNumber,
      });

      if (response.data.status) {
        // Payment initiated successfully
        setCurrentPackage((prev) => ({
          ...prev,
          planName: packageItem.planName,
          dailySurvey: packageItem.dailySurvey,
          monthlyIncome: packageItem.monthlyIncome,
          dailyIncome: packageItem.dailyIncome,
          minimumWithdrawal: packageItem.minimumWithdrawal,
          earningPerSurvey: packageItem.earningPerSurvey,
          price: packageItem.price
        }));
        setProgress(false);
        navigate("/home");
      } else {
        alert('Payment initiation failed');
        setProgress(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setProgress(false);
    }
  };

  // console.log("payment details", packageItem)
  return (
    <div>
      <Tabs />
      <Card variant="soft" sx={{ mt: 2 }} >
        {
          progress ? <LinearProgress /> : <div></div>
        }



        <Typography level="h3" fontWeight={"bold"}>Confirm Payments</Typography>
        <Divider sx={{ mb: 1 }} />
        {/* <span><Typography align="center">User Country</Typography><Typography level="title-lg" align="center">Kenya</Typography></span> */}
        <Grid xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid>
              <SelectedPackageDetails data={packageItem} />
            </Grid>
            <Grid>
              <HowToPayCard amount={packageItem.price} />
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2, mt: 2 }} />


        <Grid xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid>
              <Button style={{ backgroundColor: '#00CC71', borderRadius: "5em" }} onClick={() => setOpen(true)}>Pay Now</Button>
              <React.Fragment>
                <Modal open={open} onClose={() => setOpen(false)}>
                  <ModalDialog>
                    <DialogTitle>Pay for Package</DialogTitle>
                    <DialogContent>Enter your M-PESA phone number to initiate STK Push payment</DialogContent>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const phone = phoneNumber.trim();
                        if (!phone || !/^254[0-9]{9}$/.test(phone)) {
                          setPhoneError(true);
                          return;
                        }
                        setPhoneError(false);
                        setProgress(true);
                        handlePayment();
                      }}
                    >
                      <Stack spacing={2}>
                        <Input
                          size="lg"
                          name="phone"
                          placeholder="254XXXXXXXXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          error={phoneError}
                          helperText={phoneError ? "Please enter a valid Kenyan phone number (254XXXXXXXXX)" : ""}
                          required
                        />
                        <Button style={{ backgroundColor: '#00CC71', borderRadius: "5em" }} type="submit">Initiate Payment</Button>
                      </Stack>
                    </form>
                    {
                      progress ? <LinearProgress /> : <div></div>
                    }

                  </ModalDialog>
                </Modal>
              </React.Fragment>
            </Grid>
          </Grid>
        </Grid>
        <Alert
          variant="soft"
          color="neutral"
          sx={{ mt: 2 }}
        >
          <Typography align="left" fontWeight="bold">NOTE</Typography>
          <Typography align="left">Payment is processed via Paystack STK Push for secure and convenient transactions</Typography>
        </Alert>
      </Card>
    </div>
  )
}
