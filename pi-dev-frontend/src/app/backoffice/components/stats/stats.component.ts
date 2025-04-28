import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Post } from '../../../core/models/Post';
import { commentaires } from '../../../core/models/Comment';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  @Input() posts: Post[] = [];
  @Input() comments: commentaires[] = [];

  // Graphique 1: Posts avec leur date de création
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'dd MMM yyyy'
        },
        title: {
          display: true,
          text: 'Date de création'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Nombre de posts'
        },
        beginAtZero: true
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Évolution des posts par date de création'
      }
    }
  };
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = { labels: [], datasets: [] };

  // Graphique 2: Top posts avec plus de commentaires
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of comments'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Top 5 most commented posts'
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const post = this.topCommentedPosts[context.dataIndex];
            return `Créé le: ${new Date(post.createdAt).toLocaleDateString()}`;
          }
        }
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  // Stockage des top posts pour les tooltips
  private topCommentedPosts: any[] = [];

  ngOnInit(): void {
    this.prepareChartData();
  }

  ngOnChanges(): void {
    this.prepareChartData();
  }

  prepareChartData(): void {
    this.prepareLineChartData();
    this.prepareBarChartData();
  }

  private prepareLineChartData(): void {
    // Grouper les posts par date de création
    const postsByDate = this.posts.reduce((acc, post) => {
      if (!post.createdAt) return acc;
      
      const dateStr = new Date(post.createdAt).toISOString().split('T')[0];
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedDates = Object.keys(postsByDate).sort();
    
    this.lineChartData = {
      labels: sortedDates,
      datasets: [{
        data: sortedDates.map(date => postsByDate[date]),
        label: 'Posts créés',
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3
      }]
    };
  }

  private prepareBarChartData(): void {
    this.topCommentedPosts = this.getTopCommentedPosts(5);
    
    this.barChartData = {
      labels: this.topCommentedPosts.map(p => p.title?.slice(0, 20) || 'Post sans titre'),
      datasets: [{
        data: this.topCommentedPosts.map(p => p.commentCount),
        label: 'Commentaires',
        backgroundColor: '#FF6384'
      }]
    };
  }

  private getTopCommentedPosts(limit = 5): any[] {
    return this.posts
      .filter(post => !!post.idPost) // Filtrer les posts avec un id valide
      .map(post => ({
        ...post,
        commentCount: this.getCommentCount(post.idPost!),
        createdAt: post.createdAt || new Date().toISOString() // Valeur par défaut si createdAt manquant
      }))
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, limit);
  }

  private getCommentCount(postId: string): number {
    return this.comments.filter(c => this.getCommentPostId(c) === postId).length;
  }

  private getCommentPostId(comment: commentaires): string | undefined {
    return (comment as any).post?.idPost || (comment as any).idPost;
  }
}