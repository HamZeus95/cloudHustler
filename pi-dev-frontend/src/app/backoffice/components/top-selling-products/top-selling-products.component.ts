import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-top-selling-products',
  templateUrl: './top-selling-products.component.html',
})
export class TopSellingProductsComponent implements OnInit {
  public barChartLabels: string[] = [];
  public barChartData: ChartDataset[] = [
    { data: [], label: 'Units Sold', backgroundColor: 'rgba(75, 192, 192, 0.6)' }
  ];
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    }
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getTopSellingProducts().subscribe(data => {
      this.barChartLabels = data.map(item => item.productName);
      this.barChartData[0].data = data.map(item => item.totalQuantitySold);
      
      // If you need to trigger change detection (in case the chart doesn't update)
      this.barChartData = [...this.barChartData];
    });
  }
}