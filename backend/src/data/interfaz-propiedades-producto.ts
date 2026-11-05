type Base = { id: number; nombre: string; precio: number; };

export type PropiedadesCafe = Base & {
  tipo: 'cafe';
  tipoCafe: 'expreso' | 'filtrado';
  tamaño: 'pocillo' | 'mediano' | 'taza grande';
  variedad: 'brasil' | 'colombia' | 'etiopia';
  variedadDescripcion: string;
};

export type PropiedadesPasteleria = Base & {
  tipo: 'pasteleria';
  variedad: 'muffin de chocolate' | 'torta selva negra';
};

export type InterfazPropiedadesProducto = PropiedadesCafe | PropiedadesPasteleria;