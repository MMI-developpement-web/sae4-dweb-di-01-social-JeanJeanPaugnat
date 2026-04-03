import { useState } from "react";
import { Repeat2, Quote, X } from "lucide-react";
import Button from "./button";
import Input from "./Input";

interface RetweetModalProps {
    onClose: () => void;
    onRetweet: (comment?: string) => Promise<void>;
    submitting: boolean;
}

export default function RetweetModal({ onClose, onRetweet, submitting }: RetweetModalProps) {
    const [comment, setComment] = useState('');
    const [mode, setMode] = useState<'choice' | 'quote'>('choice');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-dark-bg text-base">
                        {mode === 'choice' ? 'Retweet' : 'Quote tweet'}
                    </h2>
                    <button onClick={onClose} className="text-light-text hover:text-dark-bg transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {mode === 'choice' ? (
                    <div className="flex flex-col p-4 gap-3">
                        <button
                            onClick={() => onRetweet()}
                            disabled={submitting}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                        >
                            <Repeat2 size={20} className="text-green-500 shrink-0" />
                            <div>
                                <p className="font-medium text-dark-bg text-sm">Retweet</p>
                                <p className="text-xs text-light-text">Share instantly without adding a comment</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setMode('quote')}
                            disabled={submitting}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                        >
                            <Quote size={20} className="text-blue-500 shrink-0" />
                            <div>
                                <p className="font-medium text-dark-bg text-sm">Quote</p>
                                <p className="text-xs text-light-text">Add your own comment to the tweet</p>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col p-4 gap-3">
                        <Input
                            placeholder="Add a comment..."
                            action="textarea"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                                text="Back"
                                variant="outline"
                                onClick={() => setMode('choice')}
                                disabled={submitting}
                            />
                            <Button
                                text={submitting ? 'Quoting…' : 'Quote'}
                                onClick={() => onRetweet(comment.trim() || undefined)}
                                disabled={submitting || comment.trim() === ''}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
