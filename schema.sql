-- Enable RLS
ALTER TABLE IF EXISTS container_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inventory_items ENABLE ROW LEVEL SECURITY;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS container_lists;

-- Create tables
CREATE TABLE container_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) NOT NULL
);

CREATE TABLE inventory_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    container_list_id UUID REFERENCES container_lists(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    job_number TEXT NOT NULL,
    manufacturer_order_number TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    item_type TEXT NOT NULL CHECK (item_type IN ('window', 'door', 'entry door', 'security door')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX container_lists_user_id_idx ON container_lists(user_id);
CREATE INDEX inventory_items_container_list_id_idx ON inventory_items(container_list_id);

-- Container Lists Policies
CREATE POLICY "Users can view their own lists"
ON container_lists FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create lists"
ON container_lists FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists"
ON container_lists FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Inventory Items Policies
CREATE POLICY "Users can view items in their lists"
ON inventory_items FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM container_lists
        WHERE id = inventory_items.container_list_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can add items to their lists"
ON inventory_items FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM container_lists
        WHERE id = inventory_items.container_list_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can update items in their lists"
ON inventory_items FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM container_lists
        WHERE id = inventory_items.container_list_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete items from their lists"
ON inventory_items FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM container_lists
        WHERE id = inventory_items.container_list_id
        AND user_id = auth.uid()
    )
);
