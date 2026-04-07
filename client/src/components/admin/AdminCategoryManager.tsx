import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCategoryManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#00ffff');

  const { data: categories, refetch } = trpc.categories.getAll.useQuery();
  const createCategoryMutation = trpc.categories.create.useMutation();
  const updateCategoryMutation = trpc.categories.update.useMutation();
  const deleteCategoryMutation = trpc.categories.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          name,
          slug,
          description,
          icon,
          color,
        });
        toast.success('Category updated');
      } else {
        await createCategoryMutation.mutateAsync({
          name,
          slug,
          description,
          icon,
          color,
        });
        toast.success('Category created');
      }
      resetForm();
      await refetch();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIcon(cat.icon || '');
    setColor(cat.color || '#00ffff');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;

    try {
      await deleteCategoryMutation.mutateAsync({ id });
      await refetch();
      toast.success('Category deleted');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setIcon('');
    setColor('#00ffff');
    setEditingCategory(null);
    setShowForm(false);
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-orbitron text-xl font-bold text-neon-green">MANAGE CATEGORIES</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-neon-green text-background hover:bg-neon-cyan font-orbitron font-bold"
        >
          <Plus size={18} className="mr-2" />
          NEW CATEGORY
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 border-neon-magenta/30">
          <h3 className="font-orbitron font-bold text-neon-magenta mb-4">
            {editingCategory ? 'EDIT CATEGORY' : 'CREATE CATEGORY'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-space-mono text-xs text-neon-cyan mb-2 block">NAME *</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCategory) {
                    setSlug(generateSlug(e.target.value));
                  }
                }}
                className="bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
                required
              />
            </div>
            <div>
              <label className="font-space-mono text-xs text-neon-cyan mb-2 block">SLUG *</label>
              <Input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
                required
              />
            </div>
            <div>
              <label className="font-space-mono text-xs text-neon-cyan mb-2 block">DESCRIPTION</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 bg-input border border-neon-cyan/30 focus:border-neon-cyan rounded-sm font-space-mono text-xs focus:outline-none min-h-16"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-space-mono text-xs text-neon-cyan mb-2 block">ICON</label>
                <Input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
                  placeholder="📺"
                />
              </div>
              <div>
                <label className="font-space-mono text-xs text-neon-cyan mb-2 block">COLOR</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-10 bg-input border-neon-cyan/30 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 bg-input border-neon-cyan/30 focus:border-neon-cyan font-space-mono text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                className="flex-1 bg-neon-magenta text-background hover:bg-neon-cyan font-orbitron font-bold"
              >
                {createCategoryMutation.isPending || updateCategoryMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    SAVING...
                  </>
                ) : (
                  'SAVE CATEGORY'
                )}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
                className="flex-1 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-orbitron font-bold"
              >
                CANCEL
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((cat) => (
          <Card key={cat.id} className="p-6 border-neon-green/30 hover:border-neon-green transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="text-3xl mb-2">{cat.icon || '📁'}</div>
                <h3 className="font-orbitron font-bold text-neon-green">{cat.name}</h3>
                <p className="font-space-mono text-xs text-muted-foreground">{cat.slug}</p>
              </div>
              <div
                className="w-8 h-8 rounded-sm border-2"
                style={{ borderColor: cat.color || '#00ffff' }}
              />
            </div>
            {cat.description && (
              <p className="font-space-mono text-xs text-muted-foreground mb-4 line-clamp-2">
                {cat.description}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(cat)}
                className="flex-1 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-space-mono text-xs"
              >
                <Edit2 size={14} className="mr-1" />
                EDIT
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(cat.id)}
                disabled={deleteCategoryMutation.isPending}
                className="flex-1 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background font-space-mono text-xs"
              >
                {deleteCategoryMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Trash2 size={14} className="mr-1" />
                    DELETE
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
