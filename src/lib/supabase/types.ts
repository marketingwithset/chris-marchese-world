/**
 * Supabase Database Types
 * Auto-generate in future with: npx supabase gen types typescript
 */

export interface Database {
  public: {
    Tables: {
      // ===== CONTENT MANAGEMENT =====
      content_items: {
        Row: {
          id: string
          zone_id: string
          title: string
          subtitle: string | null
          description: string
          media_type: 'image' | 'video' | 'embed' | null
          media_url: string | null
          metadata: Record<string, string> | null
          price: number | null
          purchasable: boolean
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          zone_id: string
          title: string
          subtitle?: string | null
          description: string
          media_type?: 'image' | 'video' | 'embed' | null
          media_url?: string | null
          metadata?: Record<string, string> | null
          price?: number | null
          purchasable?: boolean
          sort_order?: number
          is_active?: boolean
        }
        Update: Partial<Database['public']['Tables']['content_items']['Insert']>
      }

      // ===== CONTACT FORM SUBMISSIONS =====
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          source_zone: string | null
          status: 'new' | 'read' | 'replied' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          source_zone?: string | null
          status?: 'new' | 'read' | 'replied' | 'archived'
        }
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>
      }

      // ===== CART & ORDERS =====
      cart_items: {
        Row: {
          id: string
          session_id: string
          content_item_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          content_item_id: string
          quantity?: number
        }
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>
      }

      orders: {
        Row: {
          id: string
          session_id: string
          customer_email: string
          customer_name: string
          total_amount: number
          currency: string
          status: 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded'
          stripe_payment_intent_id: string | null
          shipping_address: Record<string, string> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          customer_email: string
          customer_name: string
          total_amount: number
          currency?: string
          status?: 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded'
          stripe_payment_intent_id?: string | null
          shipping_address?: Record<string, string> | null
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }

      order_items: {
        Row: {
          id: string
          order_id: string
          content_item_id: string
          title: string
          price: number
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          content_item_id: string
          title: string
          price: number
          quantity?: number
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }

      // ===== ANALYTICS =====
      analytics_events: {
        Row: {
          id: string
          session_id: string
          event_type: string
          zone_id: string | null
          room_id: string | null
          content_item_id: string | null
          metadata: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          event_type: string
          zone_id?: string | null
          room_id?: string | null
          content_item_id?: string | null
          metadata?: Record<string, unknown> | null
        }
        Update: Partial<Database['public']['Tables']['analytics_events']['Insert']>
      }

      // ===== VISITOR SESSIONS =====
      visitor_sessions: {
        Row: {
          id: string
          user_agent: string | null
          referrer: string | null
          country: string | null
          device_type: 'desktop' | 'mobile' | 'tablet' | null
          view_mode: 'world' | 'classic' | null
          total_time_seconds: number
          rooms_visited: string[]
          zones_visited: string[]
          created_at: string
          last_active_at: string
        }
        Insert: {
          id?: string
          user_agent?: string | null
          referrer?: string | null
          country?: string | null
          device_type?: 'desktop' | 'mobile' | 'tablet' | null
          view_mode?: 'world' | 'classic' | null
          total_time_seconds?: number
          rooms_visited?: string[]
          zones_visited?: string[]
        }
        Update: Partial<Database['public']['Tables']['visitor_sessions']['Insert']>
      }

      // ===== MEDIA ASSETS =====
      media_assets: {
        Row: {
          id: string
          filename: string
          storage_path: string
          mime_type: string
          size_bytes: number
          width: number | null
          height: number | null
          alt_text: string | null
          tags: string[]
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          storage_path: string
          mime_type: string
          size_bytes: number
          width?: number | null
          height?: number | null
          alt_text?: string | null
          tags?: string[]
          uploaded_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['media_assets']['Insert']>
      }

      // ===== TESTIMONIALS =====
      testimonials: {
        Row: {
          id: string
          client_name: string
          client_title: string | null
          client_company: string | null
          client_avatar_url: string | null
          quote: string
          rating: number | null
          is_featured: boolean
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          client_title?: string | null
          client_company?: string | null
          client_avatar_url?: string | null
          quote: string
          rating?: number | null
          is_featured?: boolean
          sort_order?: number
          is_active?: boolean
        }
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>
      }
    }
    Functions: Record<string, never>
    Enums: {
      media_type: 'image' | 'video' | 'embed'
      contact_status: 'new' | 'read' | 'replied' | 'archived'
      order_status: 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded'
      device_type: 'desktop' | 'mobile' | 'tablet'
      view_mode: 'world' | 'classic'
    }
  }
}
