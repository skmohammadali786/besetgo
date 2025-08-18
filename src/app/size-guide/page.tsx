import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Size Guide</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Find your perfect fit. All measurements are in inches.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="font-headline text-2xl font-bold mb-4">Standard Sizing (Kurtas, Dresses, Co-ords)</h2>
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Bust</TableHead>
              <TableHead>Waist</TableHead>
              <TableHead>Hips</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">XS</TableCell>
              <TableCell>32"</TableCell>
              <TableCell>26"</TableCell>
              <TableCell>34"</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">S</TableCell>
              <TableCell>34"</TableCell>
              <TableCell>28"</TableCell>
              <TableCell>36"</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">M</TableCell>
              <TableCell>36"</TableCell>
              <TableCell>30"</TableCell>
              <TableCell>38"</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">L</TableCell>
              <TableCell>38"</TableCell>
              <TableCell>32"</TableCell>
              <TableCell>40"</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">XL</TableCell>
              <TableCell>40"</TableCell>
              <TableCell>34"</TableCell>
              <TableCell>42"</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">XXL</TableCell>
              <TableCell>42"</TableCell>
              <TableCell>36"</TableCell>
              <TableCell>44"</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-12 prose lg:prose-lg">
            <h3 className="font-headline">How to Measure</h3>
            <ul>
                <li><strong>Bust:</strong> Measure under your arms at the fullest part of your bust. Keep the tape level.</li>
                <li><strong>Waist:</strong> Measure around your natural waistline, which is the narrowest part of your torso.</li>
                <li><strong>Hips:</strong> Stand with your feet together and measure around the fullest part of your hips.</li>
            </ul>
            <p>If you're between sizes, we recommend choosing the larger size for a more comfortable fit. For any specific questions about the fit of an item, please feel free to contact us.</p>
        </div>
      </div>
    </div>
  );
}
