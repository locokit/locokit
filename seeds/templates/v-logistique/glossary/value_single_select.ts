export const VALUES = {
  USER_STATUS: {
    1: {
      label: 'Pré-Bénéficiaire',
      color: '#c63737'
    },
    2: {
      label: 'Bénéficiaire',
      color: '#256029'
    }
  },
  ELIGIBILITY: {
    1: {
      label: 'Non éligible',
      color: '#c63737'
    },
    2: {
      label: 'Éligible',
      color: '#256029'
    },
    3: {
      label: 'En étude',
      color: '#23547b'
    }
  },
  LOT: {
    1: {
      label: 'Lot 1',
      color: '#b1492f'
    },
    2: {
      label: 'Lot 2',
      color: '#598916'
    },
    3: {
      label: 'Lot 3',
      color: '#1b5c2b'
    },
    4: {
      label: 'Lot 4',
      color: '#636a25'
    },
    5: {
      label: 'Lot 5',
      color: '#ce8a10'
    }
  },
  BIKE: {
    1: {
      label: 'VAE',
      color: '#b1492f'
    },
    2: {
      label: 'VCAE Bi',
      color: '#598916'
    },
    3: {
      label: 'VCAE Tri',
      color: '#25496a'
    }
  },
  USE: {
    1: {
      label: 'En maintenance',
      color: '#23547b',
      backgroundColor: '#b3e5fc'
    },
    2: {
      label: 'En utilisation',
      color: '#256029',
      backgroundColor: '#c8e6c9'
    },
    3: {
      label: 'Stocké',
      color: '#805b36',
      backgroundColor: '#ffd8b2'
    },
    4: {
      label: 'En commande',
      color: '#18950b',
      backgroundColor: '#738471'
    }
  },
  MAINTENANCE: {
    1: {
      label: 'Maintenance 1',
      color: '#ef1'
    },
    2: {
      label: 'Maintenance 2',
      color: '#ef1'
    },
    3: {
      label: 'Maintenance 3',
      color: '#ef1'
    }
  },
  INCIDENT: {
    1: {
      label: 'Casse',
      color: '#b1492f'
    },
    2: {
      label: 'Vol',
      color: '#d9141b'
    },
    3: {
      label: 'RAS',
      color: '#598916'
    },
    4: {
      label: 'Accident',
      color: '#875224'
    }
  },
  QUESTIONNARY: {
    1: {
      label: 'Premier contact',
      color: '#b1492f'
    },
    2: {
      label: 'Questionnaire',
      color: '#598916'
    },
    3: {
      label: 'Entretien téléphonique',
      color: '#25496a'
    },
    4: {
      label: 'Commande vélo&co',
      color: '#a043b4'
    },
    5: {
      label: 'Livré',
      color: '#ef1'
    }
  },
  KANBAN: {
    1: {
      label: 'À faire',
      color: '#b1492f'
    },
    2: {
      label: 'En cours',
      color: '#25496a'
    },
    3: {
      label: 'Fait',
      color: '#598916'
    }
  },
  SHIPMENT: {
    1: {
      label: 'Livré',
      color: '#b1492f'
    },
    2: {
      label: 'En cours de livraison',
      color: '#598916'
    },
    3: {
      label: 'Préparation de l\'envoi',
      color: '#ef1'
    },
    4: {
      label: 'Non traité',
      color: '#25496a'
    },
    5: {
      label: 'Pas de traceur',
      color: '#890423'
    }
  },
  RATING: {
    1: {
      label: 'A',
      color: '#ef1'
    },
    2: {
      label: 'B',
      color: '#ef1'
    },
    3: {
      label: 'C',
      color: '#ef1'
    },
    4: {
      label: 'D',
      color: '#ef1'
    },
    5: {
      label: 'E',
      color: '#ef1'
    },
    6: {
      label: 'Non noté',
      color: '#ef1'
    }
  }
}
export async function seed (): Promise<any> {
}
