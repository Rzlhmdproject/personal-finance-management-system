'use client';

import React, { useState } from 'react';
import { formatRupiah, calculateFinancialSummary, Transaction } from '../utils/finance';

const initialAccounts = [
  { id: 'acc-1', name: 'Rekening Utama (BCA)' },
  { id: 'acc-2', name: 'E-Wallet (Gopay/OVO/Dana)' },
  { id: 'acc-3', name: 'Dompet Tun
