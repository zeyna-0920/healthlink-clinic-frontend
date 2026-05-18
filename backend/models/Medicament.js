import mongoose from 'mongoose';

const medicamentSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom du médicament est requis'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
    },
    categorie: {
      type: String,
      enum: ['fievre', 'douleur', 'infection', 'coeur', 'diarrhee'],
      required: [true, 'La catégorie est requise'],
    },
    image: {
      type: String,
      enum: [
        'paracetamol',
        'ibuprofene',
        'amoxicilline',
        'aspirine',
        'doliprane',
        'tramadol',
        'augmentin',
        'bisoprolol',
        'azithromycine',
        'panadol',
        'smecta',
        'imodium',
      ],
      required: [true, "L'image est requise"],
    },
    dosage: {
      type: String,
      default: null,
    },
    sideEffects: {
      type: [String],
      default: [],
    },
    contraindications: {
      type: [String],
      default: [],
    },
    prixClinic: {
      type: Number,
      required: true,
    },
    prixPharmacie: {
      type: Number,
      required: true,
    },
    ordonnance: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Medicament', medicamentSchema);
